App = {
  webProvider: null,
  contracts: {},
  account: "0x0",
  adminAcess: false,
  divisonMapping: {
    0: "Barishal",
    1: "Chittagong",
    2: "Dhaka",
    3: "Khulna",
    4: "Rajshahi",
    5: "Rangpur",
    6: "Mymensingh",
    7: "Sylhet",
  },

  statusMapping: {
    0: "Missing",
    1: "Found",
  },

  divisionFilter: "all",

  init: function () {
    return App.initWeb();
  },

  initWeb: function () {
    // if an ethereum provider instance is already provided by metamask
    const provider = window.ethereum;
    if (provider) {
      // currently window.web3.currentProvider is deprecated for known security issues.
      // Therefore it is recommended to use window.ethereum instance instead
      App.webProvider = provider;
    } else {
      //  $("#loader-msg").html('No metamask ethereum provider found')
      console.log("No Ethereum provider");
      // specify default instance if no web3 instance provided
      App.webProvider = new Web3(
        new Web3.providers.HttpProvider("http://localhost:8545")
      );
    }

    return App.initContract();
  },

  initContract: function () {
    $.getJSON("missingDiary.json", function (missingDiary) {
      // instantiate a new truffle contract from the artifict
      App.contracts.MissingDiary = TruffleContract(missingDiary);

      // connect provider to interact with contract
      App.contracts.MissingDiary.setProvider(App.webProvider);

      App.listenForEvents();

      return App.render();
    });
  },

  // this function displays the missing-per-division table in descending order
  renderDivisonTable: async function () {
    var arrayOfMissingPerDivision = [];
    const missingPerDivisonTable = $("#missingPerDivisonTable");
    App.contracts.MissingDiary.deployed().then(function (instance) {
      missingPerDivisonTable.empty();
      for (let i = 0; i < 8; i++) {
        instance.missingCountByDivision(i).then(function (num) {
          arrayOfMissingPerDivision.push({
            name: App.divisonMapping[i],
            missing: +num,
          });
        });
      }
    });

    // let all data be received and execute the below code after 400ms
    setTimeout(() => {
      arrayOfMissingPerDivision.sort((a, b) => b.missing - a.missing);
      console.log(arrayOfMissingPerDivision);
      missingPerDivisonTable.empty();
      let n = 0;
      for (let i = 0; i < 8; i++) {
        if (arrayOfMissingPerDivision[i].missing > 0) {
          n++;
          var divisionTemplate =
            "<tr><th>" +
            arrayOfMissingPerDivision[i].name +
            "</th><td class='center'>" +
            arrayOfMissingPerDivision[i].missing +
            "</td></tr>";
          missingPerDivisonTable.append(divisionTemplate);
        }
      }
      // median calculation
      if (n % 2 === 0) {
        var median =
          (arrayOfMissingPerDivision[n / 2 - 1].missing +
            arrayOfMissingPerDivision[n / 2].missing) /
          2;
      } else {
        var median = arrayOfMissingPerDivision[(n + 1) / 2 - 1].missing / 2;
      }

      missingPerDivisonTable.append(
        "<tr style=\"background-color:#e0e0e0;\"><th>Median</th><td class='center'>" +
          median +
          "</td></tr>"
      );
      console.log("n ", n, " and median ", median);
    }, 400);
  },

  // this is used to filter the missing person table by division selected by the user
  filterTable: function () {
    App.divisionFilter = $("#divisionFilter").val();
    console.log(App.divisionFilter);
    localStorage.setItem("divisionFilter", App.divisionFilter);
    App.renderMissingListTable();
  },

  // this displays the missing person table
  renderMissingListTable: function () {
    let missingDiaryInstance;

    const loader = $("#loader");
    const content = $("#content");
    const missingPersonsListResults = $("#missingPersonsListResults");

    loader.show();
    content.hide();
    missingPersonsListResults.empty();

    // check if local storage has any filter value
    let savedDivisionFIlter = localStorage.getItem("divisionFilter");
    if (savedDivisionFIlter) {
      App.divisionFilter = savedDivisionFIlter;
      $("#divisionFilter").val(App.divisionFilter);
    }

    App.contracts.MissingDiary.deployed()
      .then(function (instance) {
        missingDiaryInstance = instance;
        return missingDiaryInstance.missingPersonListCounter();
      })
      .then(function (listCounter) {
        // check if there is any data
        if (listCounter == 0) {
          loader.html("There is no data available!");
          const missingPerDivisonTable = $("#missingPerDivisonTableHeader");
          missingPerDivisonTable.hide();
          return;
        }
        missingPersonsListResults.empty();

        for (let i = 1; i <= listCounter; i++) {
          missingDiaryInstance.missingPersons(i).then(function (person) {
            var status = App.statusMapping[person[3]];
            var divison = App.divisonMapping[person[5]];

            // if (status === "Found") {
            //   return 0;
            // }
            if (
              App.divisionFilter !== "all" &&
              App.divisionFilter !== divison
            ) {
              return 0;
            }
            var name = person[0];
            var age = person[1];
            var height = person[2];

            var description = person[4];

            var contactNumber = person[6];
            var personTemplate =
              "<tr><th class='center'>" +
              i +
              "</th><td class='center'>" +
              name +
              "</td><td class='center'>" +
              age +
              "</td><td class='center'>" +
              height +
              "</td><td>" +
              description +
              "</td><td class='center'>" +
              divison +
              "</td><td class='center'>" +
              contactNumber +
              "</td>";

            // checks if user is the admin
            if (App.adminAcess == true && status !== "Found") {
              // if admin and status is missing, admin will have toggleStatus feature button
              personTemplate +=
                "<td class='center'>" +
                '<button id="toggleStatusButton" onclick="App.toggleStatus(\'' +
                i +
                "')\">" +
                status +
                "</button>" +
                "</td></tr>";
            } else {
              personTemplate += "<td class='center'>" + status + "</td></tr>";
            }

            missingPersonsListResults.append(personTemplate);
          });
        }
        loader.hide();
        content.show();
      });
  },

  render: async function () {
    // render missing per division table
    App.renderDivisonTable();

    // load account data
    if (window.ethereum) {
      try {
        // recommended approach to requesting user to connect mmetamask instead of directly getting the accounts
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        App.account = accounts;
        $("#accountAddress").html("Your Account: " + App.account);
      } catch (error) {
        if (error.code === 4001) {
          // User rejected request
          console.warn("user rejected");
        }
        $("#accountAddress").html("Your Account: Not Connected");
        console.error(error);
      }
    }

    // checks if the account has admin access
    await App.contracts.MissingDiary.deployed()
      .then(function (instance) {
        return instance.isAdmin({ from: App.account[0] });
      })
      .then(function (isAdmin) {
        App.adminAcess = isAdmin;
      });

    //load contract data
    App.renderMissingListTable();
  },

  toggleForm: function () {
    var form = $("#missingForm");
    var openFormButton = $("#openFormButton");
    if (form.is(":hidden")) {
      form.show();
      openFormButton.hide();
    } else {
      form.hide();
      $("#name").val("");
      $("#age").val("");
      $("#height").val("");
      $("#description").val("");
      $("#division").val("");
      $("#contactNumber").val("");
      openFormButton.show();
    }
  },

  // triggers to change status from missing to found
  toggleStatus: function (id) {
    App.contracts.MissingDiary.deployed()
      .then(function (instance) {
        return instance.toggleStatus(+id, { from: App.account[0] });
      })
      .then(function (result) {
        console.log(result);
        alert("Status has been changed successfully");
      })
      .catch(function (error) {
        console.error(error);
      });
  },

  // add a missing person
  addMissingPerson: function () {
   
    let name = $("#name").val();
    let age = parseInt($("#age").val());
    let height = parseInt($("#height").val());
    let description = $("#description").val();
    let division = parseInt($("#division").val());
    let contactNumber = $("#contactNumber").val();

    if (App.validateForm(name, age, height, description, contactNumber) === false) {
        return 0;
    }

    console.log(name, age, height, description, division, contactNumber);

    App.contracts.MissingDiary.deployed()
      .then(function (instance) {
        return instance.addMissingPerson(
          name,
          age,
          height,
          description,
          division,
          contactNumber,
          { from: App.account[0] }
        );
      })
      .then(function (result) {
        console.log(result);
        alert("Missing Person details have been added successfully");

        // empty the form fields
        $("#name").val("");
        $("#age").val("");
        $("#height").val("");
        $("#description").val("");
        $("#division").val("");
        $("#contactNumber").val("");
      })
      .catch(function (err) {
        console.log(err);
      });
  },

  validateForm: function (name, age, height, description, contactNumber) {
    // Age validation
    if (age < 1 || age > 150) {
      alert("Age must be between 1 and 150.");
      return false;
    }

    // Height validation
    if (height < 50 || height > 300) {
      alert("Height must be between 50 and 300.");
      return false;
    }

    // Description length validation
    if (description.length < 20 || description.length > 150) {
      alert("Description must be between 20 and 50 characters.");
      return false;
    }

    // Name length validation
    if (name.length < 5) {
      alert("Name must be at least 5 characters.");
      return false;
    }

    // Contact number validation
    var contactNumberRegex = /^01\d{9}$/;
    if (!contactNumber.match(contactNumberRegex)) {
      alert('Contact number must be 11 numerical digits and start with "01".');
      return false;
    }

    // All validations passed
    return true;
  },

  // voted event
  listenForEvents: function () {
    App.contracts.MissingDiary.deployed().then(function (instance) {
      instance
        .missingPersonAddedEvent(
          {},
          {
            fromBlock: "latest",
          }
        )
        .watch(function (err, event) {
          console.log("Triggered missing person added event", event);

          App.render();
        });

      instance
        .statusUpdatedEvent(
          {},
          {
            fromBlock: "latest",
          }
        )
        .watch(function (err, event) {
          console.log("Triggered", event);

          App.render();
        });
    });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
