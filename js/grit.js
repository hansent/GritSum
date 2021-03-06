
var newContractArray = new Array;
var newContract;


var nounPhrases = new Array;

var GritData = new Array;
var rootRef = new Firebase('https://gritsum.firebaseio.com/');
var GritSumDataRaw = new Firebase('https://gritsum.firebaseio.com/phrases/');

var auth = new FirebaseSimpleLogin(rootRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log("Login Error:", error);
} else if (user) {
    // user authenticated with Firebase
    window.USER = user;
    startFriendSelector();
} else {
    console.log("noone logged in ");
    // user is logged out
}
});

var startPhrases = [];

var verbPhrases = [];

var quantPhrases = [];

var nounPhrases = [];

var rewardPhrases = [];

var timePhrases = [];

var whoPhrases = [];

var verifyPhrases = [];

var GritRawPhrases = function (f) {
    if (startPhrases.length > 0) {
        f();
        return;
    }
    GritSumDataRaw.once('value', function(data) {
        GritData = data.val();

        startPhrases = GritData.startPhrases;
        verbPhrases = GritData.verbPhrases;
        quantPhrases = GritData.nounPhrases.quantity;
        franchisePhrases = GritData.nounPhrases.franchise;
        rewardPhrases = GritData.rewardPhrases;
        verifyPhrases = GritData.verifyPhrases;
        timePhrases = GritData.timePhrases;
        f();
    });
};

var startGenerator = function () {
    startConstructor(startPhrases);
};

var inputContract;

var output;

function initApp(){

//initial state
$('#logo').show();
$('#social').show();
$('#legal').show();
$('#title').hide();
$('#verification').hide();
$('#search').hide();
$('#contractConstruction').hide();
$('#startBuild').hide();
$('#verbBuild').hide();
$('#quantBuild').hide();
$('#franchiseBuild').hide();
$('#nounBuild').hide();
$('#rewardBuild').hide();
$('#timeBuild').hide();
$('#verifyBuild').hide();
$('#sendBuild').hide();
$('#completedContract').hide();
$('.back').hide();
$('.footer').hide();
$('#friendSelector').hide();

$('.startDiv').remove();
$('.verbDiv').remove();
$('.quantDiv').remove();
$('.franchiseDiv').remove();
$('.nounDiv').remove();
$('.timeDiv').remove();
$('.rewardDiv').remove();
$('.verifyDiv').remove();
$('.sendDiv').remove();

newContractArray = [];
newContract = "";
}

initApp();


$('#fb').on('click', function() {
    // add facebook login functionallity here
    auth.login('facebook', {scope:'email,user_friends', preferRedirect:true});
});


var startFriendSelector = function(){
    var token = USER.accessToken;
    $.getJSON("https://graph.facebook.com/me/friends?access_token="+token, function(res){
        console.log(res);
        $('#social').hide();
        $('#legal').hide();

        var section = $('#friendSelector > ul');
        $.each(res.data, function(idx, friend){



            $.getJSON("https://graph.facebook.com/"+friend.id+"?access_token="+token, function(friendDetails){
                console.log("friend info", friendDetails);

                var f = friendDetails;
                //create the list element for this friend
                var imgsrc= 'http://graph.facebook.com/'+f.id+'/picture?height=100&type=normal&width=100';
                var html = "<li id="+f.id+"><a href='#'><img src='"+imgsrc+"' ><h2>"+f.name+"</h2></a></li>";
                section.append($(html));
                $("#"+f.id).on('click', function(){
                    window.oponent = f;
                    startChallengeCreation();
                });
            });

            //atach an event Handler for this friend

        });

        $('#friendSelector').show();
    });



    //startChallengeCreation();

};


var startChallengeCreation = function(){
    $('#social').hide();
    $('#friendSelector').hide();
    $('#title').show();
    //    $('#search').show(); <!-- placeholder for future development of adding the abililty to search server side (sponsored?) or server side (most popular) or local (previous challenges) -->
    $('#contractConstruction').show();
    $('#legal').hide();

    var message = oponent.first_name + " has been challenged by " + USER.thirdPartyUserData.first_name;
    $('#title').append($('<p>').text(message));
    if (startPhrases.length ===  0) {
        GritRawPhrases(startGenerator);
    }
}



var startConstructor = function (startPhrases) {
    $('#startBuild').show();

    $('.startDiv').remove();
    $('#startBuild').append($('<div>').addClass('startDiv'))
    $('.startDiv').append($('<p>').text('Choose a Starting Phrase').addClass('question'))

    for (var keyName in startPhrases) {
        var startClass = "start" + keyName;
        $('.startDiv').append($('<p>').text(startPhrases[keyName]).addClass(startClass))
    }

    var attachHandler = function(keyName) {
        var startClick = ".start" + keyName;
        $(startClick).click(function () {
            tempStart = startPhrases[keyName];
            newContractArray.push(tempStart);
            newContract = newContract + tempStart

            $('.startDiv').remove();
            $('#startBuild').hide();
            $('#verbBuild').show();
            $('.back').show();
            verbConstructor();
        });
    }

    for (var keyName in startPhrases) {
        attachHandler(keyName);
    }
}

var verbConstructor = function() {
    GritRawPhrases(function() {
        output = buildContractFormat(newContractArray);
        $('.startDiv').remove();
        $('.verbDiv').remove();
        $('#verbBuild').append($('<div>').addClass('verbDiv'))
        $('.verbDiv').append($('<p>').text(output).addClass('question'));

        for (var keyName in verbPhrases) {
            var verbClass = "verb" + keyName;
            $('.verbDiv').append($('<p>').text(verbPhrases[keyName]).addClass(verbClass))
        }

        var attachHandlerVerb = function(keyName) {
            $('#verbBack').click(function() {
                newContract = "";
                newContractArray = [];

                $('.startDiv').remove();
                $('.verbDiv').remove();
                $('.quantDiv').remove();

                $('.back').hide();
                $('#startBuild').show();
                $('#verbBuild').hide();
                startConstructor(startPhrases);
            });

            var verbClick = ".verb" + keyName;
            $(verbClick).click(function() {
                tempVerb = verbPhrases[keyName];
                newContractArray.push(tempVerb);
                newContract = output + tempVerb;

                $('#verbBuild').hide();
                $('#quantBuild').show();
                quantConstructor();
            });
        }

        for (var keyName in verbPhrases) {
            attachHandlerVerb(keyName);
        }
    });
}

var quantConstructor = function() {
    GritRawPhrases(function() {
        var output = buildContractFormat(newContractArray);
        $('.verbDiv').remove();
        $('.quantDiv').remove();
        $('#quantBuild').append($('<div>').addClass('quantDiv'));
        $('.quantDiv').append($('<p>').text(output).addClass('question'));

        for (var keyName in quantPhrases) {
            var quantClass = "quant" + keyName;
            $('.quantDiv').append($('<p>').text(quantPhrases[keyName]).addClass(quantClass))
        }

        var attachHandlerQuant = function(keyName) {
            var quantClick = ".quant" + keyName;
            $('#quantBack').click(function() {

                $('.verbDiv').remove();
                $('.quantDiv').remove();
                $('.franchiseDiv').remove();

                newContractArray.splice(1,1);
                output = buildContractFormat(newContractArray);
                $('#verbBuild').show();
                $('#quantBuild').hide();
                verbConstructor();
            });

            $(quantClick).click(function() {
                tempQuant = quantPhrases[keyName];
                newContractArray.push(tempQuant);
                newContract = output + tempQuant;

                $('#quantBuild').hide();
                $('#franchiseBuild').show();
                franchiseConstructor();
            });
        }
        for (var keyName in quantPhrases) {
            attachHandlerQuant(keyName);
        }
    });
}

var franchiseConstructor = function() {
    GritRawPhrases(function() {
        verb = (newContractArray[1]).trim();
        var output = buildContractFormat(newContractArray);
        $('.quantDiv').remove();
        $('.franchiseDiv').remove();
        $('#franchiseBuild').append($('<div>').addClass('franchiseDiv'))
        $('.franchiseDiv').append($('<p>').text(output).addClass('question'));

        for (var keyName in franchisePhrases) {
            if (verb === keyName) {
                for (var nounKey in franchisePhrases[verb]) {
                    var nounKeyClass = nounKey.replace(/\s/g, "");
                    if (nounKeyClass === "anyLocation") {
                        tempFranchise = ""
                        newContractArray.push(tempFranchise);
                        newContract = output + tempFranchise;

                        $('.quantDiv').remove();
                        $('.franchiseDiv').remove();
                        $('.nounDiv').remove();

                        $('#franchiseBuild').hide();
                        $('#nounBuild').show();
                        nounConstructor();
                    }
                    var franchiseClass = "franchise" + nounKeyClass;
                    $('.franchiseDiv').append($('<p>').text(nounKey).addClass(franchiseClass))
                }

            }

        }

        var attachHandlerFranchise = function(nounKey) {
            var nounKeyClass = nounKey.replace(/\s/g, "");
            var franchiseClick = ".franchise" + nounKeyClass;
            $('#franchiseBack').click(function() {

                $('.quantDiv').remove();
                $('.franchiseDiv').remove();
                $('.nounDiv').remove();

                newContractArray.splice(2,1);
                output = buildContractFormat(newContractArray);
                $('#quantBuild').show();
                $('#franchiseBuild').hide();
                quantConstructor();
            })

            $(franchiseClick).click(function() {
                tempFranchise = nounKey;
                newContractArray.push(tempFranchise);
                newContract = output + tempFranchise;

                $('#franchiseBuild').hide();
                $('#nounBuild').show();
                nounConstructor();
            });
        }

        for (var nounKey in franchisePhrases[verb]) {
            attachHandlerFranchise(nounKey);
        }
    });
}

var nounConstructor = function() {
    GritRawPhrases(function() {
        verb = (newContractArray[1]).trim();
        var business = (newContractArray[3]);
        var businessLocation = (business).trim();
        var output = buildContractFormat(newContractArray);
        var nouns = franchisePhrases[verb];
        var specificNouns = nouns[business];
        $('.franchiseDiv').remove();
        $('.nounDiv').remove();
        $('.rewardDiv').remove();

        $('#nounBuild').append($('<div>').addClass('nounDiv'))
        $('.nounDiv').append($('<p>').text(output).addClass('question'));

        for (var keyName in nouns) {

            if (business === keyName) {
                for (var nounKey in specificNouns) {
                    var nounClass = "noun" + nounKey;

                    $('.nounDiv').append($('<p>').text(specificNouns[nounKey]).addClass(nounClass))
                }

            }

        }

        if (keyName === "anyLocation") {
         for (var nounKey in nouns) {
            var nounList = nouns[nounKey];
            for (var keySharp in nounList) {
                var nounClass = "noun" + keySharp;
                $('.nounDiv').append($('<p>').text(nounList[keySharp]).addClass(nounClass))
            }
        }
    }

        //Handler for anyLocations
        var attachHandlerNoun = function(keyList, nounList) {
            $('#nounBack').click(function() {
                // newContract = "";
                // newContractArray = [];

                $('.quantDiv').remove();
                $('.franchiseDiv').remove();
                $('.nounDiv').remove();
                $('.rewardDiv').remove();

                $('#quantBuild').show();
                $('#nounBuild').hide();
                newContractArray.splice(2,2);
                output = buildContractFormat(newContractArray);
                quantConstructor();
            });

            var nounClick = ".noun" + keyList;
            $(nounClick).click(function() {
                tempNoun = nounList[keyList];
                newContractArray.push(tempNoun);
                newContract = output + tempNoun;
                $('#nounBuild').hide();
                $('#rewardBuild').show();
                rewardConstructor();
            });
        }

        for (var keyList in nounList) {
            attachHandlerNoun(keyList, nounList);
        }

        //Handler for all except anyLocaitons
        var attachHandlerNounAll = function(keyNoun, specificNouns) {
            $('#nounBack').click(function() {
                // newContract = "";
                // newContractArray = [];

                $('.franchiseDiv').remove();
                $('.nounDiv').remove();
                $('.rewardDiv').remove();

                $('#franchiseBuild').show();
                $('#nounBuild').hide();
                newContractArray.splice(3,1);
                output = buildContractFormat(newContractArray);
                franchiseConstructor();
            });

            var nounClick = ".noun" + keyNoun;
            $(nounClick).click(function() {
                tempNoun = specificNouns[keyNoun];
                newContractArray.push(tempNoun);
                newContract = output + tempNoun;
                $('#nounBuild').hide();
                $('#rewardBuild').show();
                rewardConstructor();
            });
        }

        for (var keyNoun in specificNouns) {
            attachHandlerNounAll(keyNoun, specificNouns);
        }

    });
};

var rewardConstructor = function() {
    var output = buildContractFormat(newContractArray);
    $('.nounDiv').remove();
    $('.rewardDiv').remove();
    $('#rewardBuild').append($('<div>').addClass('rewardDiv'))
    $('.rewardDiv').append($('<p>').text(output).addClass('question'))
    for (var keyName in rewardPhrases.combined) {
        var rewardClass = "reward" + keyName;
        $('.rewardDiv').append($('<p>').text(rewardPhrases.combined[keyName]).addClass(rewardClass))
    }

    var attachHandlerReward = function(keyName) {
        var rewardClick = ".reward" + keyName;
        $(rewardClick).click(function () {

            tempReward = rewardPhrases.combined[keyName];
            newContractArray.push(tempReward);
            newContract = newContract + tempReward;

            $('#rewardBuild').hide();
            $('#timeBuild').show();
            timeConstructor();

        });
    }

    $('#rewardBack').click(function () {
        $('.nounDiv').remove();
        $('.rewardDiv').remove();
        $('.timeDiv').remove();

        newContractArray.splice(4,1);
        output = buildContractFormat(newContractArray);
        $('#nounBuild').show();
        $('#rewardBuild').hide();
        nounConstructor();
    })

    for (var keyName in rewardPhrases.combined) {
        attachHandlerReward(keyName);
    }
}

var timeConstructor = function() {
    var output = buildContractFormat(newContractArray);
    $('.timeDiv').remove();
    $('.rewardDiv').remove();
    $('#timeBuild').append($('<div>').addClass('timeDiv'));
    $('.timeDiv').append($('<p>').text(output).addClass('question'))

    for (var keyName in timePhrases) {
        var timeClass = "time" + keyName;
        $('.timeDiv').append($('<p>').text(timePhrases[keyName]).addClass(timeClass))
    }

    var attachHandlerTime = function(keyName) {
        var timeClick = ".time" + keyName;
        $(timeClick).click(function() {

        tempTime = timePhrases[keyName];
        newContractArray.push(tempTime);
        newContract = newContract + tempTime;

        $('#timeBuild').hide();
        $('#title').hide();
        $('#verification').show();
        $('#verifyBuild').show();
        verifyConstructor();
    });
        $('#timeBack').click(function() {
            $('.rewardDiv').remove();
            $('.timeDiv').remove();
            $('.verifyDiv').remove();

            newContractArray.splice(5,1);
            output = buildContractFormat(newContractArray);
            $('#rewardBuild').show();
            $('#timeBuild').hide();
            rewardConstructor();
        })
    }

    for (var keyName in timePhrases) {
        attachHandlerTime(keyName);
    }
}

var verifyConstructor = function() {
    $('.verificationTextDiv').remove();
    $('#verification').append($('<div>').addClass('verificationTextDiv'))
    $('.verificationTextDiv').append($('<p>').text("Contract Verification"));

    var output = buildContractFormat(newContractArray);
    $('.verifyDiv').remove();
    $('#verifyBuild').append($('<div>').addClass('verifyDiv'))
    $('.verifyDiv').append($('<p>').text(output).addClass('question'))

    $('.verifyDiv').append($('<p>').text("Is the above contract CORRECT?").addClass('fubar'))
    for (i = 0; i < verifyPhrases.length; i++) {
        var verifyClass = "verify" + i;
        $('.verifyDiv').append($('<p>').text(verifyPhrases[i]).addClass(verifyClass))
    }

    var attachHandlerVerify = function(i) {

        var verifyClick = ".verify" + i;
        $(verifyClick).click(function() {
        if (verifyClick === ".verify0") {
            $('#startBuild').show();
            $('#verifyBuild').hide();
            newContractArray = [];
            newContract = "";
            startConstructor(startPhrases);
        } else {
            tempVerify = verifyPhrases[i];

            $('#verifyBuild').hide();
            $('#verification').hide();
            $('#sendBuild').show();
            sendConstructor();
        };
    });
        $(verifyBack).click(function() {
            $('.timeDiv').remove();
            $('.verifyDiv').remove();
            $('.sendDiv').remove();

            newContractArray.splice(6,1);
            output = buildContractFormat(newContractArray);
            $('#timeBuild').show();
            $('#verifyBuild').hide();
            timeConstructor();
        })
    }

    for (i = 0; i < verifyPhrases.length; i++) {
        attachHandlerVerify(i);
    }
}




var sendConstructor = function() {

    $('.sendDiv').remove();
    $('#sendBuild').append($('<div>').addClass('sendDiv'));
    $('.sendDiv').append($('<p>').text("Sending to Facebook").addClass('question'));

    console.log("AUTH RESPONSE", FB.getAuthResponse());


    FB.ui({method: 'apprequests',
      message: buildContractFormat(newContractArray),
      to: window.oponent.id,
    }, function(response){
        console.log(response);
        initApp();
        startFriendSelector();
    });


}

var buildContractFormat = function(CA) {
    var output = "";
    for (i = 0; i < CA.length; i++) {
        output = output + CA[i];
    }
    return output;
}
