function uploadButtonHandler(){
    var inputTitle = document.getElementById("title-input").value
    var inputContent = document.getElementById("submission-input").value

    if (!inputTitle || !inputContent){
        alert("Cannot submit a document without both a title and content!")
    } else{
        fetch("/addDoc", {
            method: "POST",
            body: JSON.stringify({
                title: inputTitle,
                content: inputContent
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res){
            if (res.status == 200){
                res.json().then(data => {
                    console.log(data);
                    //clear input fields
                    document.getElementById("submission-input").value = "";
                    document.getElementById("title-input").value = "";
                    document.getElementById("currently-viewing").innerHTML = inputTitle;
                    document.getElementById("text-display").innerHTML = data.text; // Use the data here
                    
                    //Remove all children from the list
                    var list = document.getElementById("plagiarized-documents");
                    while (list.firstChild) {
                        list.removeChild(list.firstChild);
                    }

                    if (data.docs.length == 0){
                        //create a list element called "none"
                        var docElement = document.createElement("li");
                        docElement.innerHTML = "None";
                        document.getElementById("plagiarized-documents").appendChild(docElement);
                    }
                    for (var i = 0; i < data.docs.length; i++){
                        var doc = data.docs[i];
                        var docName = doc.name;
                        var docScore = doc.score;
                        docScore = docScore.toFixed(2);
                        var docElement = document.createElement("li");
                        docElement.innerHTML = docName + " - " + docScore + "%";
                        document.getElementById("plagiarized-documents").appendChild(docElement);
                    }
                });

                /*console.log(res.json())
                //clear input fields
                document.getElementById("submission-input").value = ""
                document.getElementById("title-input").value = ""

                //Insert text in appropriate places on page:
                //Set 'currently viewing
                document.getElementById("currently-viewing").innerHTML = inputTitle
                //Set text content (which should now be highlighted)
                //document.getElementById("text-display").innerHTML = res.json().text
                //Set plagiarism percentage
                
                //Set text for documents containing the plagiarism*/

            } else{
                alert("An error occured while saving the document.")
            }
        }).catch(function (err){
            alert("An error occured while saving the document with error: " + err)
        })
    }
}

function clearButtonHandler(){
    document.getElementById("title-input").value = ""
    document.getElementById("submission-input").value = ""
}

window.addEventListener("DOMContentLoaded", function(){
    var uploadButton = document.getElementById("upload-text-button")
    uploadButton.addEventListener("click", uploadButtonHandler)

    var clearButton = document.getElementById("clear-text-button")
    clearButton.addEventListener("click", clearButtonHandler)
})