$(document).ready(function () {
    var socket = io.connect('http://localhost:8890');
    var $usuarioRemitente = $('#usuario_remitente');
    var $usuarioDestinatario = $('#usuario_destinatario');
    var $user_connected = $('#user_connected');
    var $users_connected = $('#users_connected');
    var $chat = $('.chat');
    var $messageBox = $('#message');
    var $messageForm = $('#send-message');



    socket.emit('new_user', $usuarioRemitente.val(), function (data) {
        if (!data) {
            console.log("Error al cargar usuario");
        }else{
            console.log("Usuario conectado");
        }
    });
          
    socket.on('usernames', function (data) {
        var cadenas = {cad1: '' , cad2: ''};
        $.each(data, function (index, value) {
            if (index !== $usuarioRemitente.val()) {
                cadenas.cad1 += armarUsuarios(value[0], index, $usuarioRemitente.val());
                $users_connected.html(cadenas.cad1);
            } else {
                cadenas.cad2 = armarUsuarios(value[0], index, $usuarioRemitente.val());
                $user_connected.html(cadenas.cad2);
            }
        });
    });
    
    socket.on('load_old_msgs', function (data) {
        var cadena = '';
        $.each(data, function (index, value) {
            cadena += armarMensajes(value);
            $chat.html(cadena);
        });
    });

    $messageForm.submit(function (e) {
        e.preventDefault();
        var data = {remitente: $usuarioRemitente.val(), destinatario: $usuarioDestinatario.val(),
            mensaje: $messageBox.val(), url: $messageForm.attr('action')};
        socket.emit('send_message', data, function (data) {
            $chat.append('<span class="error">' + data + "</span><br/>");
        });
        $messageBox.val('');
    });


    socket.on('new_message', function (data) {
        displayMsg(data);
    });

    socket.on('whisper', function (data) {
        displayPrivateMsg(data);
    });

    socket.on('save_ajax', function (data) {
        saveMessageAjax(data);
    });

    function displayMsg(data) {
        $chat.append('<span class="msg"><b>' + data.usuario + ': </b>' + data.mensaje + "</span><br/>");
    }

    function displayPrivateMsg(data) {
        $chat.append('<span class="msg"><b>' + data.usuario + ': </b>' + data.mensaje + "</span><br/>");
    }

    function saveMessageAjax(data) {
        $.ajax({
            type: "POST",
            headers:{'X-CSRF-Token': $('input[name="_token"]').val()},
            url: data.params.url,
            dataType: "json",
            data: {'mensaje': data.messageModel.mensaje, 'usuario_remitente': data.messageModel.remitente,
            'usuario_destinatario': data.messageModel.destinatario},
            success: function (data) {
                if (data.mensaje !== undefined && data.mensaje !== "") {
                    var datos = {remitente: data.model.usuario_remitente, destinatario: data.model.usuario_destinatario};
                    socket.emit('cargar_mensajes', datos, function (data) {
                        if (!data) {
                            console.log("Error al cargar mensajes");
                        }else{
                            console.log("Cargando mensajes antiguos");
                        }
                    });
                }
                if (data.errores !== undefined && data.errores !== "") {
                    return false;
                }
            }, error: function () {
                return false;
            }
        });

    }
    
    function armarUsuarios(data, id, usuario_remitente) {
        console.log(data);
        var html = '';
        html += '<div class="row ' + ((id !== usuario_remitente) ? 'destinatario' : '') + '" data-socket="'+data.socket_id+'" id="'+ id + '">';
        html += '<div class="col-sm-6 clo-md-4 col-lg-4">';
        html += '<span class="chat-img pull-left">';
        html += '<img src="http://localhost:8080/psp/public_html/images/unknown-person.jpg" class="img-circle" style="width:30px; height:30px" alt="avatar">';
        html += '</span>';
        html += '</div>';
        html += '<div class="col-sm-6 clo-md-8 col-lg-8">';
        html += '<h5><strong>' + data.nombre + '</strong></h5>';
        html += '</div>';
        html += '</div>';
        html += ((id !== usuario_remitente) ? '<hr>' : '');
        return html;
    }
    
    function armarMensajes(data) {
        var html = '';
        html += '<li class="' + (($usuarioRemitente.val() != data.usuario_remitente) ? 'right' : 'left') + ' clearfix">';
        html += '<span class="chat-img pull-' + (($usuarioRemitente.val() != data.usuario_remitente) ? 'right' : 'left') + '">';
        html += '<img src="http://localhost:8080/psp/public_html/images/unknown-person.jpg" class="img-circle" style="width:30px; height:30px" alt="avatar">';
        html += '</span>';
        html += '<div class="chat-body clearfix">';
        html += '<div class="header">';
        html += '<strong class="primary-font' + (($usuarioRemitente.val() != data.usuario_remitente) ? ' pull-right' : '') + '">'+ 'Jack Sparrow' +'</strong>';
        html += '<small class="pull-' + (($usuarioRemitente.val() == data.usuario_remitente) ? 'right' : 'left') + ' text-muted">';
        html += '<i class="fa fa-calendar" aria-hidden="true"></i> ' + data.created_at;
        html += '</small>';
        html += '</div>';
        html += '<div class="body"><p>' + data.mensaje + '</p></div>';
         html += '</div>';
        html += '</li>';
        return html;
    }
    
    $(document).on('click', ".destinatario" , function() {
        var data = {remitente: $usuarioRemitente.val(), destinatario: $(this).attr('id'), destinatario_socket: $(this).data('socket')};
        $usuarioDestinatario.val(data.destinatario);
        socket.emit('cargar_mensajes', data, function (data) {
            if (!data) {
                console.log("Error al cargar mensajes");
            }else{
                console.log("Cargando mensajes antiguos");
            }
        });
        
    });
       
});
