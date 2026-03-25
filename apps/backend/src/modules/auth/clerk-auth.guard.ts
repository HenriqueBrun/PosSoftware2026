import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import { UsersService } from '../users/users.service';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const verifiedToken = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      const clerkId = verifiedToken.sub;

      // Auto-provision: find or create the internal DB user
      // The Clerk token doesn't contain email/name,
      // so we pass a placeholder and update later if needed
      let user = await this.usersService.findByClerkId(clerkId);

      if (!user) {
        // Create a minimal user record linked to this Clerk ID
        user = await this.usersService.create({
          email: `${clerkId}@clerk.placeholder`,
          name: clerkId,
          clerkId,
        });
      }

      // Attach resolved internal user info to request
      request.user = {
        userId: user.id, // Internal DB UUID — compatible with all existing controllers
        clerkId,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired session token');
    }
  }
}
