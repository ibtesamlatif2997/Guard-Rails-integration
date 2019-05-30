$("#registerForm").submit(function(e) {
    var form = $(this);

    $.ajax({
           type: "POST",
           url: "/register",
           data: form.serialize(), // serializes the form's elements.
           success: function(response){
             if(response.code === "E_UNIQUE_FIELD_VIOLATION"){
                alert(response.data.field_name + ": " + response.data.field_value + " already exists");
             }
             else if (response.code === "CREATED"){
               alert("You are registered successfully.");
               window.location = "/"
             }
           },
           error: function(data){
             console.log(data);
             alert("Something went wrong on server.");
           }
         });

    e.preventDefault(); // avoid to execute the actual submit of the form.
});
