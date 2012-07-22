var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');

var os_templates = {
    trackInSearch: _.template('<tr><td><i class="icon-music"></i></td><td><%= name %></td><td><%= artists %></td><td><%= album%></td><td><button class="btn fnct_plus <%= disabled%>"><i class="icon-plus"></i></button></td></tr>'),

    trackInAlbum: _.template('<tr><td><i class="icon-music"></i></td><td><%= number %></td><td><%= name %></td><td><%= artists %></td><td><button class="btn fnct_plus <%= disabled%>"><i class="icon-plus"></i></button></td></tr>'),

    album: _.template('<tr><td><i class="icon-book"></i></td><td><%= name %></td><td><%= year %></td></tr>'),

    currentlyPlaying: _.template('<h5><%= name %></h5><p><%= artists %></p>'),

    trackInQueue: _.template('<li class="playlist_fellows"><i class="icon-music"></i><strong><%= name %></strong> - <%= artists %></li>')
};
var SIO_URL = '';
var os_init = function () {
   var u = $('#os_server').val();
   SIO_URL = (u.indexOf('http') == 0 ? '' : 'http://')+ u + (u.lastIndexOf('/') == (u.length-1) ? '':'/' ) ;
    $.ajax({
        url: SIO_URL + 'socket.io/socket.io.js',
        dataType: "script",
        success: function () {
            var socket = io.connect(SIO_URL+'controll');
            socket.on('connect',

            function () {
                socket.emit('country', models.session.country);

                socket.emit('password_change', $('#os_pass').val());

                socket.on('playmusic_order',

                function (t) {
                    models.player.play(t.href);
                    socket.emit('playing', t);
                    if (!_.isEmpty(t)) {
                        $('#playing').html(os_templates.currentlyPlaying({
                            name: t.name,
                            artists: _.pluck(t.artists, 'name').join(', ')
                        }));
                    }

                });


                socket.on('volume_up',

                function (msg) {
                    if (models.player.volume < 1) {
                        models.player.volume = models.player.volume + 0.1;
                    }
                });

                socket.on('volume_down',

                function (msg) {
                    console.log(models.player.volume > 0);
                    if (models.player.volume > 0) {
                        models.player.volume = (models.player.volume - 0.1);
                        console.log(models.player.volume - 0.1);
                    }
                });

                models.player.observe(models.EVENT.CHANGE,

                function (e) {
                    //         console.log(e);
                    if (e.type == 'playerStateChanged' && e.data.curtrack) {
                        //          socket.emit('nextmusic_ask', {});
                    }
                });



            })
        }
    });
}


$(function () {

    $('form button').click(os_init);


});