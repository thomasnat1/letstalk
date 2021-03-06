$(document).ready(function() {
  if(page == "myProfile") {
    updateProfilePreview();
    updateVisiblePreview();

    function updateProfilePreview() {
      setTimeout(function () {
        $('#name').text($("input[name='name']").val());
        $('#seeking p').text($("input[name='seeking']").val());
        $('#age').html("<b>Age:</b> " + $("input[name='age']").val());
        $('#location p').text($("input[name='location']").val());
        $('#profession p').text($("input[name='profession']").val());
        $('#religiousBeliefs p').text($("input[name='religiousBeliefs']").val());
      }, 1);
    }

    function updateVisiblePreview() {
      if ($("input.showOnCardBox[name='showName']:checked").val()) {
        $('#name').slideDown();
      } else {
        $('#name').slideUp();
      }
      if ($("input.showOnCardBox[name='showSeeking']:checked").val()) {
        $('#seeking').slideDown();
      } else {
        $('#seeking').slideUp();
      }
      if ($("input.showOnCardBox[name='showAge']:checked").val()) {
        $('#age').slideDown();
        $("#ageGenderHr").slideDown();
      } else {
        $('#age').slideUp();
        if (!$("input.showOnCardBox[name='showGender']:checked").val()) {
          $("#ageGenderHr").slideUp();
        }
      }
      if ($("input.showOnCardBox[name='showGender']:checked").val()) {
        $('#gender').slideDown();
        $("#ageGenderHr").slideDown();
      } else {
        $('#gender').slideUp();
        if (!$("input.showOnCardBox[name='showAge']:checked").val()) {
          $("#ageGenderHr").slideUp();
        }
      }
      if ($("input.showOnCardBox[name='showLocation']:checked").val()) {
        $('#location').slideDown();
      } else {
        $('#location').slideUp();
      }
      if ($("input.showOnCardBox[name='showProfession']:checked").val()) {
        $('#profession').slideDown();
      } else {
        $('#profession').slideUp();
      }
      if ($("input.showOnCardBox[name='showReligiousBeliefs']:checked").val()) {
        $('#religiousBeliefs').slideDown();
      } else {
        $('#religiousBeliefs').slideUp();
      }
      if ($("input.showOnCardBox[name='showPicture']:checked").val()) {
        $('#picture').slideDown();
      } else {
        $('#picture').slideUp();
      }
    }


    $('input.form-control').keydown(updateProfilePreview);
    $('input[name="gender"]').click(function () {
      $('#gender b').text($(this).val());
    });

    $('input.showOnCardBox').click(updateVisiblePreview);
  }





  var cardTemplate = _.template('<div class="col-sm-3" id="<%= profileIdentifier %>"> <div id="profilePreview" data-toggle="modal" data-target="#inviteModal"> <div id="informationRegion"> <% if(showName && name!=""){ %> <div id="name" style=""><%= name %></div> <% } %> <% if(showPicture && picture!=""){ %> <img id="picture" src="<%= picture %>" height="70px"> <% } %> <% if(showSeeking && seeking!=""){ %> <div id="seeking"> <b>Seeking:</b><br><p><%= seeking %></p> </div> <% } %> <% if((showAge || showGender) && (name!="" || age!="")){ %> <hr id="ageGenderHr"> <% } %> <% if(showAge && age!=""){ %> <div id="age"><b>Age:</b> <%= age %></div> <% } %> <% if(showGender && gender!="" && gender!="male"){ %> <div id="gender"><b><%= gender %></b></div> <% } %> <% if(showLocation && location!=""){ %> <div id="location"><hr><b>Location:</b><br><p><%= location %></p></div> <% } %> <% if(showProfession && profession!=""){ %> <div id="profession"><hr><b>Profession:</b><br><p><%= profession %></p></div> <% } %> <% if(showReligiousBeliefs && religiousBeliefs!=""){ %> <div id="religiousBeliefs"><hr><b>Religious Beliefs:</b><br><p><%= religiousBeliefs %></p></div> <% } %> </div> </div> </div> ');

  // Prompt the user for a name to use.
  var name = 'Thomas';
  var currentStatus = "online";

  // Get a reference to the presence data in Firebase.
  var userListRef = new Firebase("https://lettucetalk.firebaseio.com/");

  // Generate a reference to a new location for my user with push.
  var myUserRef = userListRef.push();

  // Get a reference to my own presence status.
  var connectedRef = new Firebase("https://lettucetalk.firebaseio.com//.info/connected");

  connectedRef.on("value", function (isOnline) {
    if (isOnline.val()) {
      // If we lose our internet connection, we want ourselves removed from the list.
      myUserRef.onDisconnect().remove();

      // Set our initial online status.
      setUserStatus("online");
    }
    else {
      // We need to catch anytime we are marked as offline and then set the correct status. We
      // could be marked as offline 1) on page load or 2) when we lose our internet connection
      // temporarily.
      setUserStatus(currentStatus);
    }
  });

  // A helper function to let us set our own state.
  function setUserStatus(status) {
    // Set our status in the list of online users.
    currentStatus = status;
    myUserRef.set({ profile: userProfile, status: status });
  }

  if(page == 'home') {
    // Update our GUI to show someone"s online status.
    userListRef.on("child_added", function (snapshot) {
      var aProfile = snapshot.val().profile;
      console.log(aProfile.picture);
      if(aProfile.picture != userProfile.picture || aProfile.name != userProfile.name || aProfile.location != userProfile.location) {
        aProfile.profileIdentifier = snapshot.key();

        var newCard = cardTemplate(aProfile);
        $("#onlineProfiles").append(newCard);
        $("#" + aProfile.profileIdentifier).click(function (e) {
          $('.modal-title').text("Invite " + aProfile.name + " to talk!");
          $('#inviteProfile').html(cardTemplate(aProfile));
        });
      }
    });

    // Update our GUI to remove the status of a user who has left.
    userListRef.on("child_removed", function (snapshot) {
      $("#onlineProfiles").children("#" + snapshot.key()).remove();
    });

    // Update our GUI to change a user"s status.
    userListRef.on("child_changed", function (snapshot) {
      var user = snapshot.val();
      $("#onlineProfiles").children("#" + snapshot.key()).remove();
      var aProfile = snapshot.val().profile;
      aProfile.profileIdentifier = snapshot.key();
      $("#onlineProfiles").append(cardTemplate(aProfile));
    });

    $('#sendInvitation').click(function(e){
      e.preventDefault();
    });
  }
  var awayCallback = function() {
//    setUserStatus("On page but inactive");
  };
  var awayBackCallback = function() {
//    setUserStatus("online");
  };
  var hiddenCallback = function() {
//    setUserStatus("Open in other tab");
  };
  var visibleCallback = function(){
    setUserStatus("online");
  };

  var idle = new Idle({
    onHidden : hiddenCallback,
    onVisible : visibleCallback,
    onAway : awayCallback,
    onAwayBack : awayBackCallback,
    awayTimeout : 6000
  });
  idle.start();
});

