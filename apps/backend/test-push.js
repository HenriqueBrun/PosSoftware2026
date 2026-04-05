const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:pills@example.com',
  'BPOv4q6rO4gEnBGXu8u4zRzkU6YljcVrx1KMb-tIh6yfCIv5qvaw-HGGwbZa_H19WigD6oFwPCTXSbEHBTLyVk0',
  '8nOD_VSBaR_lxmbRtr_-3_LMfGEkLbPeKYC_R904H7g'
);

const pushSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/dhdz2x4Svco:APA91bHCzGaCnr8CwSprAnZPudmFi6kudHWoJWb-kfzA-Q6GxqnBj4K2w47G0ObT00QLPC8ih10VdF2heRpj5IWaUIXQ2IVSSgLFYWPdSwN-WnFFZzLeP8pPRxi26AaZDIbtKJbHFYUR',
  keys: {
    auth: 'Td-LCGFX38S6GVHsODpbHg',
    p256dh: 'BOWnWgi2IGrI81ga3KFz4T61XfPANxh7dZ7a9NW-T1-1vv0545Vd36n1DY-1X6n4bdCpPbhElOR_ke11rfjCyBg'
  }
};

const payload = JSON.stringify({
  title: 'TEST FROM CLI',
  body: 'Is this working?',
  icon: '/pill-icon.png'
});

async function run() {
  try {
    const res = await webpush.sendNotification(pushSubscription, payload, { TTL: 60 });
    console.log('SUCCESS:', res.statusCode);
  } catch (error) {
    console.error('ERROR:', error);
  }
}

run();
