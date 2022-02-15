let stompClient = null;

$(function (){
    $("#messagesList").hide();

    $("#connect").click(function (){
        let name = $("#yourName").val();
        if(name.length < 2 || name.includes(',')){
            $("#successName").text("Name length is wrong!");
        }
        else{
            connect(name);
            $("#successName").text("Name set successfully!");
        }
    });

    $("#send").click(function (){
        sendPrivateMessage();
    });
});

function connect(username){
    let socket = new SockJS('/our-ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({username : username}, function (){
        stompClient.subscribe('/user/home/private-messages', function (message) {
            showMessage(message);
        });
    });
}

function showMessage(message){
    $("#messages").append("<tr><td>"+"From:<br>Subject:<br>Message:"+"</td><td>"+message.body+"</td><td>"+new Date().toLocaleString()+"</td></tr>");
    $("#messagesList").show();
    new noty({
        layout: "bottomRight",
        text: message.body,
    }).show();
}

function sendPrivateMessage(){
    let users = extractUsers($("#toUser").val());
    let subject = $("#subject").val();
    let messageContent = $("#messageContent").val();

    if(users.forEach(user => user.length > 2) || messageContent.length < 1){
        $("#successSent").text("Message wasn't sent!");
    }
    else{
        users.forEach(user => stompClient.send("/ws/private-message", {}, user+ "<br><em>" +subject+ "</em><br>" +messageContent));
        $("#successSent").text("Message sent successfully!");
    }
}

function extractUsers(usersList){
    return usersList.split(', ');
}


