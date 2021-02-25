
export default function (notif = true, action) {
     if (action.type == 'notifStatus') {
          return action.notif
     } else {
          return notif
     }
}