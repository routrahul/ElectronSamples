var remote = require('remote')
var Menu = remote.require('menu')
var menu  = Menu.buildFromTemplate([
  {
    label:'Electron',
    submenu:[
      {
        label:'Sound Control',
        submenu:[
          {
            label:'Volume',
            submenu:[
              {
                label:'Pause',
                accelerator:'Alt+Space',
                click:function(){
                  pauseMusic();
                }
              },
              {
                label:'Volume Up',
                accelerator:'Alt+U',
                click:function(){
                  increaseVolume();
                }
              },
              {
                label:'Volume Down',
                accelerator:'Alt+D',
                click:function(){
                  reduceVolume();
                }
              }
            ]
          }
        ]
      },
      {
        label:'Track Controls',
        submenu:[
          {
            label:'Next Track',
            click:function(){
              
            }
          }
        ]
      }
    ]
  }
]);
Menu.setApplicationMenu(menu)
