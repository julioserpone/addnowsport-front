function changePassword()
{
    var oldPassword = $('#old_password').val();
    var newPassword = $('#new_password').val();
    var samePassword = $('#same_password').val();

    var route = '/changePassword';
    var token = $('#_token').val();

    if(oldPassword.length > 0 && newPassword.length > 0 && newPassword.length == samePassword.length){
        $.ajax({
            url: route,
            headers: {'X-CSRF-TOKEN': token},
            type: 'POST',
            datatype: 'json',
            data:{
                oldPassword: oldPassword, newPassword: newPassword, samePassword: samePassword
            },

            success: function(result)
            {
                var obj = JSON.parse(result);
                if(obj.response == 'ok')
                {
                    alert('Contraseña cambiara exitosamente');
                }

                else if(obj.response == 'error_password')
                {
                    alert('la nueva clave debe coindicir o tener almenos 8 caracteres');
                }

            }
        });
    }
}