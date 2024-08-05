
// Asegúrate de que el DOM esté completamente cargado antes de ejecutar el script

$(function () {


    // Adjunta un controlador de eventos de envío al formulario con id "form"
    $("#form").submit(function (e) {

        // Previene el comportamiento predeterminado del envío del formulario
        e.preventDefault();
        
        // Obtiene el valor del campo de entrada con id "numero"
        const numero = $("#numero");
        const idSH = numero.val(); 
        
        // Expresión regular para validar si la entrada contiene caracteres alfabéticos
        let stringValidation = /[a-zA-Z]/gim;

        // Valida la entrada: verifica si contiene caracteres alfabéticos o está fuera del rango 1-731
        if (idSH == stringValidation || idSH > 731 || idSH < 1) { 
            // Muestra una alerta si la entrada es inválida
            alert(`El número ingresado (${idSH}) no está dentro del rango especificado, inténtelo de nuevo.`);
        } else { 
            // Realiza una solicitud AJAX a la API de superhéroes si la entrada es válida
            $.ajax({
                type: "GET",
                dataType: "json",
                url: `https://superheroapi.com/api.php/10225865940492837/${idSH}`, 

                // Define la función de callback para el éxito de la solicitud
                success: function (datos) {

                    // Desestructura las estadísticas de poder de la respuesta de la API
                    let {
                        'intelligence': int,
                        'strength': str,
                        'speed': spd,
                        'durability': drb,
                        'power': pwr,
                        'combat': cmb
                    } = datos.powerstats;

                    // Rellena el HTML con los datos del superhéroe
                    $("#documentacion").html(`
                        <div class='card-group'>
                            <div class='card mb-3' style="max-width: 540px; background-color:dark">
                                <div class='row g-0'>
                                    <div class='col-md-4'>
                                        <img id='superPicture' src='${datos.image.url}' class='img-fluid rounded-start' alt='...'></img>
                                    </div>
                                    <div class='col-md-8'>
                                        <ul class='list-group list-group-flush'>
                                            <li id='superHero' class='list-group-item'>
                                                <h5 class='card-title' style="text-shadow: #0e0d08 0.1em 0.1em 0.2em; font-size: 30px;"><em>${datos.name}</em></h5>
                                                <p><strong>Conexiones</strong>: ${datos.connections["group-affiliation"]}, ${datos.connections.relatives}</p>
                                            </li>
                                            <li id='super' class='list-group-item'><p><strong>Publicado por</strong>: ${datos.biography.publisher}</p></li>
                                            <li id='super' class='list-group-item'><p><strong>Ocupación</strong>: ${datos.work.occupation}</p></li>
                                            <li id='super' class='list-group-item'><p><strong>Primera aparición</strong>: ${datos.biography["first-appearance"]}</p></li>
                                            <li id='super' class='list-group-item'><p><strong>Altura</strong>: ${datos.appearance.height}</p><p><strong>Peso</strong>: ${datos.appearance.weight}</p></li>
                                            <li id='super' class='list-group-item'><strong>A.K.A.</strong>: ${datos.biography.aliases}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <div id="chartContainer" ></div>
                                </div>
                            </div>
                        </div>
                    `);

                    // Configura las opciones para el gráfico de pastel con las estadísticas de poder
                    let options = {
                        title: {
                            text: `Estadísticas de poder de ${datos.name}`
                        },
                        animationEnabled: true,
                        data: [{
                            type: "pie",
                            startAngle: 40,
                            toolTipContent: "<b>{label}</b>: {y}",
                            showInLegend: "true",
                            legendText: "{label}",
                            indexLabelFontSize: 16,
                            indexLabel: "{label} - {y}",
                            dataPoints: [{
                                    y: int,
                                    label: "Intelligence"
                                },
                                {
                                    y: str,
                                    label: "Strength"
                                },
                                {
                                    y: spd,
                                    label: "Speed"
                                },
                                {
                                    y: drb,
                                    label: "Durability"
                                },
                                {
                                    y: pwr,
                                    label: "Power"
                                },
                                {
                                    y: cmb,
                                    label: "Combat"
                                },
                            ]
                        }]
                    };

                    // Renderiza el gráfico de pastel en el contenedor "chartContainer"
                    $("#chartContainer").CanvasJSChart(options); 
                },
                // Define la función de callback para el error de la solicitud
                error: function (error) {
                    console.log(error);
                },
            });
        };
    });
});