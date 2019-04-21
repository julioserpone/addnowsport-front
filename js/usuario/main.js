function updateProfile()
{
    var nombre = $('#nombre-modal').val();
    var apellido = $('#apellido-modal').val();
    var correo = $('#correo-modal').val();
    var dia = $('#dia-modal').val();
    var mes = $('#mes-modal').val();
    var year = $('#year-modal').val();
    var pais = $('#pais-modal').val();
    var prefijo = $('#prefijo-modal').val();
    var telefono = $('#telefono-modal').val();
    var provincia = $('#provincia-modal').val();
    var grupo =  $('#grupo-modal').val();
    var nombre_contacto =  $('#nombre-contacto-modal').val();
    var prefijo_contacto =  $('#prefijo-contacto-modal').val();
    var telefono_contacto =  $('#telefono-contacto-modal').val();
    var derivacion = $('#derivacion-modal').val();

    var route = '/usuario/perfil/edit';
    var token = $('#_token').val();

    $.ajax({
        url: route,
        headers: {'X-CSRF-TOKEN': token},
        type: 'POST',
        datatype: 'json',
        data:{
            nombre: nombre, apellido: apellido, correo: correo, dia: dia,
            mes: mes, year: year, pais: pais, prefijo: prefijo, telefono: telefono,
            provincia: provincia, grupo: grupo, nombreContacto: nombre_contacto,
            prefijoContacto: prefijo_contacto, telefonoContacto: telefono_contacto,
            derivacion: derivacion
        },

        success: function(result)
        {
            var obj = JSON.parse(result);
            if(obj.response == 'ok')
            {
                $('#nombre').val(nombre);
                $('#apellido').val(apellido);
                $('#correo').val(correo);
                $('#dia').val(dia);
                $('#mes').val(mes);
                $('#year').val(year);
                $('#pais').val($('#pais-modal option:selected').text());
                $('#prefijo').val($('#prefijo-modal option:selected').text());
                $('#telefono').val(telefono);
                $('#provincia').val(provincia);
                $('#grupo').val(grupo);
                $('#nombre-contacto').val(nombre_contacto);
                $('#prefijo-contacto').val($('#prefijo-contacto-modal option:selected').text());
                $('#telefono-contacto').val($('#telefono-contacto-modal option:selected').text());
                $('#derivacion').val(derivacion);
            }

        }
    });

}
