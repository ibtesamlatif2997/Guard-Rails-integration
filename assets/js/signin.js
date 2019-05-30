$("#loginForm").submit(function(e) {
    var form = $(this);

    $.ajax({
           type: "POST",
           url: "/signin",
           data: form.serialize(), // serializes the form's elements.
           success: function(response){
             console.log("response");
             console.log(response);

             if(response.code === "E_WRONG_PASSWORD"){
                alert(response.message);
             }
             else if (response.code === "OK"){
               window.location = "/showUsers"
             }
           },
           error: function(data){
             alert("Something went wrong on server.");
           }
         });

    e.preventDefault(); // avoid to execute the actual submit of the form.
});
