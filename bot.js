const Discord = require('discord.js'); // Import the discord.js module
const client = new Discord.Client(); // Create an instance of a Discord client


const PersistentCollection = require('djs-collection-persistent'); // Lets us use Persistent Collections for storage
const globalTable = new PersistentCollection({name: "clientGlobal"}); //Load the global table for all general bot settings


var math = require('mathjs'); // load math.js


//Connect client
client.on('ready', () => {
  console.log('Client Instantiated.');
});

// Authenticate login
client.login("MzQxNjkzNzEyODg1MDg4MjU3.DGEyoA.m0UrOyxIU_vk50l3orqYMDeAoHg");



// Event listener for messages
client.on('message', message => {

	//anti-jk
	if (message.content == "jk") {
		message.delete()
		 .then(msg => console.log(`Deleted message from ${msg.author}`))
		 .catch(console.error);
	}

	console.log("[" + message.channel.name + "|" + message.channel.id + "] [" + message.author.username + "] " + message.content);

	var cmdCheck = message.content.substring(0, clientInfo.cmdChar.length);

	if (message.author.id == client.user.id) {
		message.channel.stopTyping(true);
	}

	if (cmdCheck === clientInfo.cmdChar && message.author.id != client.user.id) {
		message.content = message.content.substring(clientInfo.cmdChar.length, 2000);
		runCommand(message);
	}

	/*else if (message.mentions.members.first() && message.mentions.members.first().user.id == client.user.id) {
		console.log(message.mentions.members.first().user.id);
		AIhandler(message);
	}*/

});


//Event listener for reactions I think?
client.on('messageReactionAdd', (messageReaction, user) => {
	console.log(messageReaction);
	// Update the content of a message

	/*if (messageReaction.message == e6Obj.)

	var embed = {};
	embed.author = {
		icon_url: "https://e621.net/favicon.ico",
		url: "https://e621.net/post/show/" + data[0].id,
		name: tags + " (" + data.length + " results)"
	};
	//embed.title = "For " + message.author.username;
	embed.image = {url: data[0].file_url};
	embed.footer = {text: "Tip: Click the tags at the top to go to the image's page!"};


	messageReaction.message.edit('This is my new content!')
	  .then(msg => console.log(`Updated the content of a message from ${msg.author}`))
	  .catch(console.error);*/

});


client.on('guildMemberAdd', member => {
	var embed = {};
	embed.description = "**" + member.user + " has joined!**";
	embed.color = 0x00ff00;
    embedify(member.guild.defaultChannel, embed);
});


client.on('guildMemberRemove', member => {
	var embed = {};
	embed.description = "**" + member.user + " has left...**";
	embed.color = 0xff0000;
	var dest = member.guild.defaultChannel;
	if (dest == '343037022648401920') {
		dest = '388192448058228738';
	}
    embedify(dest, embed);
});



 client.on('messageDelete', (message) => {
	if (message.author.id != client.user.id && message.member.guild.id != '286564602731429899' && message.author.id != 'DIS349310768010756099') {

		console.log(message);
		var embed = {};
		embed.author = {name: message.author.username, icon_url: "https://cdn.discordapp.com/avatars/" + message.author.id + "/" + message.author.avatar + ".jpg"};
		embed.title = "Message was deleted:";
		embed.color = 0x010101;
		embed.description = message.mentions._content;
		if (message.attachments) embed.author.url = message.attachments.url;
		embed.footer = {text: "You cannot hide your sins."};

		//embedify(message.channel, embed);
		//console.log(message.mentions._content);

	}

});


// Instantiate global variables

var clientInfo = {};
clientInfo.cmdChar = "~";
clientInfo.name = "Petal";
clientInfo.version = "Gene A3, Seed 13, Iteration 2";
clientInfo.started = new Date();

var userInfo = {
	ranks: {
		'122072911455453184': 5,
		'349310768010756099': 5
	}
}



// Declare global functions

function rndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

String.prototype.allTrim = String.prototype.allTrim ||
 function(){
	return this.replace(/\s+/g,' ')
			   .replace(/^\s+|\s+$/,'');
 };

function shuffleArray(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}




function runCommand(message) {
	var suffixRaw = message.content.split(' ');
	var suffix = message.content.toLowerCase().replace(/[^0-9a-z ]/gi, '').split(' ');
	var suffixNum = message.content.toLowerCase().replace(/[^0-9 ]/gi, '').split(' ');

	var suffixes = {
		suffixRaw: suffixRaw,
		suffix: suffix,
		suffixNum: suffixNum,
		string: suffix.slice(1).join(' ')
	}

	var invokedCmd = suffixes.suffix[0];

	var rank = 0;
	if (userInfo.ranks[message.author.id]) {
		rank = userInfo.ranks[message.author.id];
	}


	else if (commands[invokedCmd]) {

		message.channel.startTyping();

		if (rank >= commands[invokedCmd].level) {

			console.log("Command Invoked: " + invokedCmd + " [" + suffixes.suffix + "]" + " | Invoker: " + message.author);

			commands[invokedCmd].fn(suffixes, message);

		}
		else {
			embedify(message.channel, {description: "You need rank **" + commands[invokedCmd].level + "** to access this command. Your rank is **" + rank + "**."},'error')
		}

	}

	else {

		var cmdObj = Object.keys(commands);
		var done = false;

		for (i = 0; i < cmdObj.length && done == false; i++) {

			if (commands[cmdObj[i]].aliases && (commands[cmdObj[i]].aliases.indexOf(invokedCmd) > -1)) {

				message.channel.startTyping();

				console.log("Command Invoked via Alias: " + invokedCmd + " [" + suffixes.suffix + "]" + " | Invoker: " + message.author);

				if (rank >= commands[cmdObj[i]].level) {
					commands[cmdObj[i]].fn(suffixes, message);
				}
				else {
					embedify(message.channel, {description: "You need rank **" + commands[invokedCmd].level + "** to access this command. Your rank is **" + rank + "**."},'error')
				}

				done = true;

			}

		}

	}

}


function listCmds (destination, option) {

	var cmdList = [];
	var cmdKeys = Object.keys(commands);

	for (i = 0; i < cmdKeys.length; i++) {
		if (commands[cmdKeys[i]].level === 0) {
			if (cmdList[0])
				cmdList[0] = cmdList[0] + "* " + commands[cmdKeys[i]].name + "\n";
			else
				cmdList[0] = "* " + commands[cmdKeys[i]].name + "\n";
		}
		if (commands[cmdKeys[i]].level === 1) {
			if (cmdList[1])
				cmdList[1] = cmdList[1] + "* " + commands[cmdKeys[i]].name + "\n";
			else
				cmdList[1] = "* " + commands[cmdKeys[i]].name + "\n";
		}
		if (commands[cmdKeys[i]].level === 2) {
			if (cmdList[2])
				cmdList[2] = cmdList[2] + "* " + commands[cmdKeys[i]].name + "\n";
			else
				cmdList[2] = "* " + commands[cmdKeys[i]].name + "\n";
		}
		if (commands[cmdKeys[i]].level === 3) {
			if (cmdList[3])
				cmdList[3] = cmdList[3] + "* " + commands[cmdKeys[i]].name + "\n";
			else
				cmdList[3] = "* " + commands[cmdKeys[i]].name + "\n";
		}

	}

	var cmdString = "```markdown\n";
	if (cmdList[0] /*&& userPerms >= 0*/) {
		cmdString = cmdString + "Commands\n=================\n"
		cmdString = cmdString + cmdList[0] + "\n";
	}
	if (cmdList[3] /*&& userPerms >= 3*/) {
		cmdString = cmdString + "Admin Commands\n=================\n"
		cmdString = cmdString + cmdList[3];
	}
	cmdString = cmdString + "```";

	var embed = {};
	embed.description = cmdString;
	embed.footer = {text: "Use " + clientInfo.cmdChar + "help [commandName] for help with a specific command."};
	embed.author = {name: "Command List"};

	embedify(destination, embed, "standard");

}

function embedify(destination, embedObj, preset, message, option) {

	/*
	If certain things -- like color, author, etc -- are reused a lot,
	we can make a preset for it here to save space.
	*/

	//In case only a preset is given
	if (embedObj === null) {
		embedObj = {}; //Instantiate the object
		if (!preset) { //Return error if nothing was sent to embedify
			preset = "error";
			embedObj.description = "No object or preset was given to the embedifier.";
		}
	}


	if (preset == "error") {
		embedObj.color = 0xff0000;
		embedObj.author = {name: "ERROR"};
	}

	if (preset == "standard") {
		embedObj.color = 0xac5fca;
	}

	if (preset == "server" && message) {
		embedObj.color = 0xce0000;
		embedObj.author = {};
		embedObj.author.name = message.guild.name;
		embedObj.author.icon_url = message.guild.iconURL;
	}


	destination.send({embed: embedObj})
	.then( function (message) { if(option[0] == "e621"){e6Obj.message = {res: option[1], mes: message} }});

}


// Command Objects


var commands = {};

commands.help = {
	name: "Help",
	help: "What would you like some *help* with?~",
	usage: "help ([commandName])",
	level: 0,
	fn: function (suffixes, message) {
		if (suffixes.suffix[1]) { //Checks if the user supplied an arguement

			if (commands[suffixes.suffix[1]]) { //Checks that the command exists
				result = "**"+commands[suffixes.suffix[1]].name + "**: " + commands[suffixes.suffix[1]].help; //Creates the string: "**Name**: Command info"
				if (commands[suffixes.suffix[1]].aliases) {result = result + "\n**Aliases**: " + commands[suffixes.suffix[1]].aliases.join(' ');} //If command has aliases, display them on a new line
				if (commands[suffixes.suffix[1]].usage) {result = result + "\n```" + commands[suffixes.suffix[1]].usage + "```";} //If command has usage info, display it on a new line

				message.channel.send(result); //Sends the string we created
			}
			else {
				message.channel.send("That's not a command.");
			}
		}
		else { //If not, gives general list of commands
			listCmds(message.author);
		}
	}
}

commands.say = {
	name: "Say",
	help: "I'll say whatever you order me to say~",
	aliases: ['mock', 'mimic', 'repeat'],
	usage: "say [string]",
	level: 0,
	fn: function (suffixes, message) {
		suffixes.suffixRaw.shift();
		if (suffixes.suffixRaw.join(' ').allTrim().substr(0,1) == clientInfo.cmdChar) {
			message.channel.send("While I enjoy touching myself, talking to myself just doesn't do it for me.");
		}
		else
			message.channel.send(suffixes.suffixRaw.join(' ')+"\n`From " + message.author.username + "`" );
	}
}

commands.owo = {
	name: "owo",
	help: "What's this~? owo",
	aliases: ['echo', 'shout', 'repeat'],
	usage: "owo hello world",
	level: 0,
	fn: function (suffixes, message) {

		var text = suffixes.string;
		text = text.replaceAll('l', 'w').replaceAll('r', 'w') + " owo";
		message.channel.send(text);
	}
}

commands.math = {
	name: "math",
	help: "",
	aliases: [],
	usage: "math [expression]",
	level: 0,
	fn: function (suffixes, message) {
		suffixes.suffixRaw.shift();

		var input = suffixes.suffixRaw.join(' ');
		console.log(input);

		var expr = input;

		try {
			var res = math.eval(expr);
			console.log(res);
			console.log(res[0]);

			if (res.string) {
				res = res.string;
			}

			message.channel.send(res);
		}
		catch(err) {
			message.channel.send("My calculator broke... Sorry!\n`" + err + "`");
		}

	}
}

var e6Obj = {};
commands.e621 = {
	name: "e621",
	help: "Your one-stop command for furry porn!",
	aliases: ['e6'],
	usage: "e621 [tags]",
	level: 0,
	fn: function (suffixes, message) {

		var tags;
		var tagsUrl;

		if (suffixes.suffixRaw[7]) {
			message.channel.send("That's too many tags! You can only search for 6 tags at most... please?");
		}

		else if (suffixes.suffixRaw[1] || 1 == 1) {
			suffixes.suffixRaw.shift();
			tags = suffixes.suffixRaw.join(' ');
			tagsUrl = suffixes.suffixRaw.join('%20');

			if (!suffixes.suffixRaw[5]) {
				tags = tags + " order:random";
				console.log(tags);
			}


			var Furry = require("e621");
			var e621 = new Furry();

			e621.getFurry(320, tags, "Petal")
			.then((data) => {

				if (data.length > 0) {

					shuffleArray(data);

					for (i = 0; i < 3; i++) {
						if (data[i]) {
							console.log(data[i]);
							var embed = {};
							embed.image = {url: data[i].file_url};

							var artist = "" + data[i].artist[0]; //avoid aliasing
							embed.description = "**["+data[i].artist+"](https://e621.net/post/index/1/" + artist.replace(")", "\)") + ")** | **Score: **"+data[i].score+" | **Favs: **"+data[i].fav_count+" | **[Link](https://e621.net/post/show/" + data[i].id + ")**";
							if (i == 0) {
									embed.author = {
									icon_url: message.author.avatarURL,
									url: "https://e621.net/post/index/1/" + tagsUrl,
									name: tags + " (" + data.length + " results)"
								};
							}
							if (i == 2 || i == (data.length - 1)) embed.footer = {text: "End of results for "+ message.author.username +"'s e621 search", icon_url: "https://e621.net/favicon.ico"};

							embedify(message.channel, embed, "standard", null, ["e621", data]);
						}
					}

				}

				else {
					message.channel.send("Sorry, I couldn't find anything for those tags! Either you mispelled something, or they're just too specifically kinky~");
				}


			}).catch(() => {
				message.channel.send("I got a bit *tied up* while looking... Sorry!\n\n`[Please check that you're not using any weird unicode characters.]`");
			});




		}
		else {
			message.channel.send("I'm not good at mind-reading, so you'll have to tell me what tags to search for~");
		}

	}
}



commands.draw = {
	name: "draw",
	help: "I'll pick something random for everyone to draw!",
	aliases: ['drawdare', 'sketch'],
	usage: "draw ([category])",
	level: 0,
	fn: function (suffixes, message) {

		var drawObj = {
			sets: {
				pokemon: [
					"abomasnow", "abra", "absol", "accelgor", "aegislash", "aerodactyl", "aggron", "aipom", "alakazam", "alomomola", "altaria", "amaura", "ambipom", "amoonguss", "ampharos", "amphibian", "anorith", "arbok", "arcanine", "arceus", "archen", "archeops", "ariados", "armaldo", "aromatisse", "aron", "arthropod", "articuno", "attack deoxys", "audino", "aurorus", "avalugg", "axew", "azelf", "azumarill", "azurill", "baby kangaskhan", "bagon", "baltoy", "banette", "barbaracle", "barboach", "basculin", "bastiodon", "bayleef", "beak", "bear", "beartic", "beautifly", "beedrill", "beheeyem", "beldum", "bellossom", "bellsprout", "bergmite", "bibarel", "bidoof", "binacle", "bisharp", "blastoise", "blaziken", "blissey", "blitzle", "boldore", "bonsly", "border", "bouffalant", "bovine", "braixen", "braviary", "breloom", "bronzong", "bronzor", "budew", "buizel", "bulbasaur", "buneary", "bunnelby", "burmy", "butterfree", "cacnea", "cacturne", "camerupt", "carbink", "carnivine", "carracosta", "carvanha", "cascoon", "castform", "caterpie", "celebi", "cervine", "chandelure", "chansey", "charizard", "charmander", "charmeleon", "chatot", "cherrim", "cherubi", "chesnaught", "chespin", "chikorita", "chimchar", "chimecho", "chinchou", "chingling", "cinccino", "clamperl", "clauncher", "clawitzer", "claydol", "clefable", "clefairy", "cleffa", "cloyster", "cobalion", "cofagrigus", "combee", "combusken", "conkeldurr", "corphish", "corsola", "cottonee", "cradily", "cranidos", "crawdaunt", "cresselia", "crest", "croagunk", "crobat", "crocodilian", "croconaw", "crustle", "cryogonal", "cubchoo", "cubone", "cyndaquil", "darkrai", "darmanitan", "darumaka", "dedenne", "deerling", "deino", "delcatty", "delibird", "delphox", "deoxys", "dewgong", "dewott", "dialga", "diggersby", "diglett", "ditto", "dodrio", "doduo", "donphan", "doublade", "dragalge", "dragonair", "dragonite", "drapion", "dratini", "drifblim", "drifloon", "drilbur", "drowzee", "druddigon", "ducklett", "dugtrio", "dunsparce", "duosion", "durant", "dusclops", "dusknoir", "duskull", "dustox", "dwebble", "eelektrik", "eelektross", "eevee", "eeveelution", "ekans", "electabuzz", "electivire", "electrike", "electrode", "elekid", "elgyem", "emboar", "emolga", "empoleon", "entei", "equine", "escavalier", "espeon", "espurr", "everything", "excadrill", "exeggcute", "exeggutor", "exploud", "farfetch'd", "fearow", "feebas", "fennekin", "feraligatr", "ferroseed", "ferrothorn", "finneon", "flaaffy", "flabébé", "flareon", "fletchinder", "fletchling", "floatzel", "floette", "florges", "flygon", "foongus", "forretress", "fraxure", "frillish", "froakie", "frogadier", "froslass", "furfrou", "furret", "gabite", "gallade", "galvantula", "garbodor", "garchomp", "gardevoir", "gastly", "gastrodon", "genesect", "gengar", "geodude", "gible", "gigalith", "girafarig", "giratina", "glaceon", "glalie", "glameow", "glare", "gligar", "gliscor", "gloom", "gogoat", "gogoatt", "golbat", "goldeen", "golduck", "golem", "golett", "golurk", "goodra", "goomy", "gorebyss", "gothita", "gothitelle", "gothorita", "gourgeist", "granbull", "graveler", "greninja", "grimer", "grotle", "groudon", "grovyle", "growlithe", "grumpig", "gulpin", "gurdurr", "gyarados", "happiny", "hariyama", "haunter", "hawlucha", "haxorus", "heatmor", "heatran", "heliolisk", "helioptile", "heracross", "herdier", "hippopotas", "hippowdon", "hitmonchan", "hitmonlee", "hitmontop", "ho-oh", "honchkrow", "honedge", "hoothoot", "hoppip", "horn", "horsea", "houndoom", "houndour", "humanoid", "huntail", "hydreigon", "hyena", "hypno", "igglybuff", "illumise", "infernape", "inkay", "ivysaur", "jellicent", "jigglypuff", "jirachi", "jolteon", "joltik", "jumpluff", "jynx", "kabuto", "kabutops", "kadabra", "kakuna", "kangaskhan", "karrablast", "kecleon", "keldeo", "kingdra", "kingler", "kirlia", "klang", "klefki", "klink", "klinklang", "koffing", "krabby", "kricketot", "kricketune", "krokorok", "krookodile", "kyogre", "kyurem", "lairon", "lampent", "landorus", "lanturn", "lapras", "larvesta", "larvitar", "latias", "latios", "leafeon", "leavanny", "ledian", "ledyba", "lickilicky", "licking", "lickitung", "liepard", "lileep", "lilligant", "lillipup", "linoone", "litleo", "litwick", "lombre", "lopunny", "lotad", "loudred", "lucario", "ludicolo", "lugia", "lumineon", "lunatone", "luvdisc", "luxio", "luxray", "machamp", "machoke", "machop", "magby", "magcargo", "magikarp", "magmar", "magmortar", "magnemite", "magneton", "magnezone", "makuhita", "malamar", "mammal", "mamoswine", "manaphy", "mandibuzz", "manectric", "mankey", "mantine", "mantyke", "maractus", "mareep", "marill", "marine", "marowak", "marshtomp", "masquerain", "mawile", "medicham", "meditite", "meganium", "", "meloetta", "meowstic", "meowth", "mesprit", "metagross", "metang", "metapod", "mew", "mewtwo", "mienfoo", "mienshao", "mightyena", "milotic", "miltank", "mime jr.", "minccino", "minun", "misdreavus", "mismagius", "mohawk", "moltres", "monferno", "mothim", "mr. mime", "mudkip", "muk", "munchlax", "munna", "murkrow", "musharna", "natu", "nidoking", "nidoqueen", "nidoran", "nidoran♀", "nidoran♂", "nidorina", "nidorino", "nincada", "ninetales", "ninjask", "noctowl", "noibat", "noivern", "normal castform", "nosepass", "numel", "nuzleaf", "octillery", "oddish", "omanyte", "omastar", "onix", "oshawott", "pachirisu", "palkia", "palpitoad", "pancham", "pangoro", "panpour", "pansage", "pansear", "paras", "parasect", "patrat", "pawniard", "pelipper", "persian", "petilil", "phanpy", "phantump", "phione", "pichu", "pidgeot", "pidgeotto", "pidgey", "pidove", "pignite", "pikachu", "piloswine", "pincers", "pineco", "pinsir", "piplup", "plusle", "politoed", "poliwag", "poliwhirl", "poliwrath", "ponyta", "poochyena", "porcine", "porygon", "porygon-z", "porygon2", "primeape", "prinplup", "probopass", "psyduck", "pumpkaboo", "pupitar", "purrloin", "purugly", "pyroar", "quagsire", "quilava", "quilladin", "qwilfish", "raichu", "raikou", "ralts", "rampardos", "rapidash", "raticate", "rattata", "rayquaza", "regice", "regigigas", "regirock", "registeel", "relicanth", "remoraid", "reshiram", "reuniclus", "rhydon", "rhyhorn", "rhyperior", "riolu", "roggenrola", "roselia", "roserade", "rotom", "rufflet", "sableye", "salamence", "samurott", "sandile", "sandshrew", "sandslash", "sawk", "sawsbuck", "scatterbug", "sceptile", "scizor", "scolipede", "scrafty", "scraggy", "scyther", "seadra", "seaking", "sealeo", "seedot", "seel", "seismitoad", "sentret", "serperior", "servine", "seviper", "sewaddle", "sharpedo", "shaymin", "shedinja", "shelgon", "shellder", "shellos", "shelmet", "shieldon", "shiftry", "shinx", "shroomish", "shuckle", "shuppet", "sigilyph", "silcoon", "simipour", "simisage", "simisear", "skarmory", "skiddo", "skiploom", "skitty", "skorupi", "skrelp", "skuntank", "slaking", "slakoth", "sliggoo", "slit pupils", "sloth", "slowbro", "slowking", "slowpoke", "slugma", "slurpuff", "smeargle", "smoochum", "sneasel", "snivy", "snorlax", "snorunt", "snover", "snubbull", "solosis", "solrock", "spearow", "spewpa", "spheal", "spinarak", "spinda", "spiritomb", "spoink", "spritzee", "squirrel", "squirtle", "stantler", "staraptor", "staravia", "starly", "starmie", "staryu", "steelix", "stoutland", "stunfisk", "stunky", "sudowoodo", "suicune", "sunflora", "sunkern", "surskit", "swablu", "swadloon", "swalot", "swampert", "swanna", "swellow", "swinub", "swirlix", "swoobat", "sylveon", "taillow", "talonflame", "tangela", "tangrowth", "tauros", "teddiursa", "tentacles", "tentacool", "tentacruel", "tepig", "terrakion", "throh", "thundurus", "timburr", "tirtouga", "togekiss", "togepi", "togetic", "toony", "torchic", "torkoal", "tornadus", "torterra", "totodile", "toxicroak", "tranquill", "trapinch", "treecko", "trevenant", "tropius", "trubbish", "turtwig", "tympole", "tynamo", "typhlosion", "tyranitar", "tyrantrum", "tyrogue", "tyrunt", "umbreon", "unfezant", "unown", "ursaring", "uxie", "vanillish", "vanillite", "vanilluxe", "vaporeon", "venipede", "venomoth", "venonat", "venusaur", "vespiquen", "vibrava", "victini", "victreebel", "vigoroth", "vileplume", "virizion", "vivillon", "volbeat", "volcarona", "voltorb", "vullaby", "vulpix", "wailmer", "wailord", "walrein", "wartortle", "watchog", "weavile", "weedle", "weepinbell", "weezing", "whimsicott", "whirlipede", "whiscash", "whiskers", "whismur", "wigglytuff", "wingull", "wobbuffet", "woobat", "wooper", "wormadam", "wurmple", "wynaut", "xatu", "xerneas", "yamask", "yanma", "yanmega", "yveltal", "zangoose", "zapdos", "zebstrika", "zekrom", "zigzagoon", "zoroark", "zorua", "zubat", "zweilous", "zygarde", "zygarde 50 forme"
				],
				rainworld: ['slugcat', 'lizard', 'daddy', 'lantern mouse', 'iterator', 'bat fly', 'overseer', 'scavenger', 'vulture'],
				dogs: ['poodle', 'wolf', 'pug', 'golden retreiver', 'husky'],
				cats: ['tabby', 'tiger', 'lion', 'panther', 'ocelot'],
				smallanimals: ['hamster', 'bunny', 'rat', 'guinea pig', 'mouse'],
				exoticanimals: ['parrot']
			},
			adj: ['skinny', 'chubby', 'thicc', 'skeletal', 'normal', 'tall', 'short', 'pygmy', 'buff', 'chad', 'virgin', 'edgy', 'funny', 'nazi', 'commie', 'gay', 'masculine', 'feminine'],
			pose: ['sleeping', 'walking', 'lying on its back', 'eating', 'running'],
			expression: ['frowning', 'crying', 'smiling', 'bored', 'embarrassed', 'confused', 'surprised', 'shocked', 'scared', 'shame', 'focused', 'exhausted', 'angry', 'sad', 'happy', 'disgusted', 'frustrated'],
			arousal: ['fully aroused', 'mostly aroused', 'half aroused', 'partially aroused', 'barely aroused', 'not at all aroused', 'somewhat turned-off', 'very turned-off', 'straight-up having an orgasm']
		}

		var categories = Object.keys(drawObj.sets);

		if (categories.indexOf(suffixes.suffix[1]) > -1) {
			message.channel.send("Not yet ready!");
		}
		else {
			var rndSet = categories[rndInt(0,(categories.length - 1))];
			console.log("Draw > rndSet: " + rndSet);

			var rndSelection = drawObj.sets[rndSet][rndInt(0,(drawObj.sets[rndSet].length - 1))];
			console.log("Draw > rndSelection: " + rndSelection);

			var rndAdj = drawObj.adj[rndInt(0,(drawObj.adj.length - 1))];
			var rndPose = drawObj.pose[rndInt(0,(drawObj.pose.length - 1))];
			var rndExpress = drawObj.expression[rndInt(0,(drawObj.expression.length - 1))];
			var rndArousal = drawObj.arousal[rndInt(0,(drawObj.arousal.length - 1))];

			var embed = {};
			embed.author = {name: "Draw Dare!"};
			embed.description = "The following has been randomly selected for you to draw. Try to draw it in 10 minutes!\n" +
			"**Draw a(n) " + rndAdj + ", " + rndPose + " " + rndSelection + " that is " + rndExpress + " and " + rndArousal + "!**";
			embed.fields = [
				{
					name: "Category",
					value: rndSet,
					inline: true
				},
				{
					name: "Selection",
					value: rndSelection,
					inline: true
				},
				{
					name: "Adjective",
					value: rndAdj,
					inline: true
				},
				{
					name: "Pose/Action",
					value: rndPose,
					inline: true
				},
				{
					name: "Expression",
					value: rndExpress,
					inline: true
				},
				{
					name: "Arousal",
					value: rndArousal,
					inline: true
				}
			];

			embedify (message.channel, embed, 'standard');

		}
	}
}


var todObj = {};
commands.tod = {
	name: "ToD",
	help: "I'll help you with an exciting game of Truth or Dare! I might help myself too, if it gets too exciting...~",
	aliases: [],
	usage: "tod start\ntod join\ntod leave\ntod list\ntod pick {[@mention] || random}\ntod end\ntod dare\ntod truth",
	level: 0,
	fn: function (suffixes, message) {

		if (message.guild && (message.guild.available === true)) {

			var guildID = message.guild.id;

			if(suffixes.suffix[1] == "start") {

				console.log(guildID);

				if (todObj[guildID]) {
					message.channel.send("Wait, you already started a game of ToD in this server! End that one first, or continue playing it!");
				}

				else {
					message.channel.send("**A game of Truth or Dare has started! If you want to join, type `"+clientInfo.cmdChar+"tod join`!**");

					todObj[guildID] = {
						players: {

						},
						currentRound: {
							round:0,
							currentUser:"NOBODY",
							waiting: {

							}
						},
						points: {

						}
					};

					todObj[guildID].players[message.author.id] = message.author.username;
					todObj[guildID].currentRound.waiting[message.author.id] = message.author.username;
					todObj[guildID].points[message.author.id] = 0;
				}

			}

			else if(suffixes.suffix[1] == "join") {

				if (todObj[guildID]) {
					console.log(todObj);

					if (todObj[guildID].players[message.author.id]) {
						message.channel.send("You want to be in the list twice? That's pretty kinky! Not allowed, though.");
					}
					else {
						todObj[guildID].players[message.author.id] = message.author.username;
						todObj[guildID].currentRound.waiting[message.author.id] = message.author.username;
						todObj[guildID].points[message.author.id] = 0;
						message.channel.send("You're in, <@" + message.author.id + ">!");
					}

				}
				else {
					message.channel.send("Your eagerness is cute, but you need to start the game first!");
				}
				console.log(todObj);

			}

			else if(suffixes.suffix[1] == "leave") {

				if (todObj[guildID]) {

					if (todObj[guildID].players[message.author.id]) {
						delete todObj[guildID].players[message.author.id];
						if (todObj[guildID].currentRound.waiting[message.author.id])
							delete todObj[guildID].currentRound.waiting[message.author.id];
						message.channel.send("Had enough fun? I hope to see you again!");
						console.log(todObj);
					}
					else {
						message.channel.send("You aren't even playing! How much more could I possibly remove you from the game? Should I remove you from the server??");
					}

				}
				else {
					message.channel.send("But there's not even a ToD game happening in this server! Are you trying to remove yourself in advance??");
				}

			}

			else if(suffixes.suffix[1] == "list") {

				if (todObj[guildID]) {

					var text = "Here is who's in the game:\n`";

					for (i = 0; i < Object.keys(todObj[guildID].players).length; i++) {
						text = text + todObj[guildID].players[Object.keys(todObj[guildID].players)[i]] + " [" + todObj[guildID].points[message.author.id] + " pts]";
						if (i != (Object.keys(todObj[guildID].players).length - 1))
							text = text + "\n";
					}

					text = text + "`\n\n These people haven't had a turn yet:\n`";

					for (i = 0; i < Object.keys(todObj[guildID].currentRound.waiting).length; i++) {
						text = text + todObj[guildID].currentRound.waiting[Object.keys(todObj[guildID].currentRound.waiting)[i]];
						if (i != (Object.keys(todObj[guildID].currentRound.waiting).length - 1))
							text = text + ", ";
					}

					text = text + "`\n";

					text = text + "It is currently " + todObj[guildID].currentRound.currentUser + "'s turn.";

					embedify(message.channel, {author: {name: "Truth or Dare"},description: text}, "client");

				}
				else {
					message.channel.send("Nobody is playing because nobody started a game yet!");
				}

			}

			else if(suffixes.suffix[1] == "pick") {

				if (todObj[guildID]) {
					if (Object.keys(todObj[guildID].players).length > 1) {

						if (suffixes.suffix[2]) {

							if (todObj[guildID].currentRound.waiting[suffixes.suffix[2]]) {
								todObj[guildID].points[suffixes.suffix[2]]+=1;
								message.channel.send("**<@"+suffixes.suffix[2]+ ">, Truth or Dare?**\nYou were picked by <@" + message.author.id + ">.");
								todObj[guildID].currentRound.currentUser = todObj[guildID].players[suffixes.suffix[2]];
								delete todObj[guildID].currentRound.waiting[suffixes.suffix[2]];
								console.log(todObj[guildID].points);
							}

							else if (suffixes.suffix[2] == "random") {

								var selectList = Object.keys(todObj[guildID].currentRound.waiting);
								var selection = selectList[rndInt(0,(selectList.length -1))];
								while (selection == message.author.id) {
									selection = selectList[rndInt(0,(selectList.length -1))];
									console.log("ToD Selection Bounced.")
								}
								todObj[guildID].points[suffixes.suffix[2]]+=1;
								message.channel.send("**<@"+selection+ ">, Truth or Dare?**\nYou were randomly picked by <@" + message.author.id + ">.");
								todObj[guildID].currentRound.currentUser = todObj[guildID].players[selection];
								delete todObj[guildID].currentRound.waiting[selection];
								console.log(todObj[guildID].points);
							}

							else if (todObj[guildID].players[suffixes.suffix[2]]) {
								message.channel.send("That person already went this round! You must really like them~\nAlas, you have to pick someone who hasn't went.");
							}

							else {
								message.channel.send("That person isn't playing! Make sure you're using a @mention and that they're actually in the game, silly~");
							}

							if (Object.keys(todObj[guildID].currentRound.waiting).length < 1) {
								console.log("ToD: Reset");
								todObj[guildID].currentRound.waiting = JSON.parse(JSON.stringify(todObj[guildID].players));
							}

						}
						else {
							message.channel.send("Who are you picking? @mention someone that hasn't gone yet, or use `random` and I'll pick for you.");
						}


					}
					else {
						message.channel.send("There's not enough people playing! You can't play with yourself!\n ... I mean, you could 👀 But not if we're talking about ToD.");
					}
				}
				else {
					message.channel.send("Your eagerness is cute, but you need to start the game first!");
				}

			}

			else if(suffixes.suffix[1] == "skip") {

				todObj[guildID].points[message.author.id]-=1;

				var selectList = Object.keys(todObj[guildID].currentRound.waiting);
				var selection = selectList[rndInt(0,(selectList.length -1))];
				while (selection == message.author.id) {
					selection = selectList[rndInt(0,(selectList.length -1))];
					console.log("ToD Selection Bounced.")
				}
				todObj[guildID].points[suffixes.suffix[2]]+=1;
				message.channel.send("Point forfeited~!\n**<@"+selection+ ">, Truth or Dare?**\nYou were randomly select since <@" + message.author.id + "> skipped their turn.\n**First come first serve!** Somebody give them a Truth or Dare~!");
				todObj[guildID].currentRound.currentUser = selection;
				delete todObj[guildID].currentRound.waiting[selection];
				console.log(todObj[guildID].points);
			}

			else if(suffixes.suffix[1] == "end") {

				if (todObj[guildID]) {
					delete todObj[guildID];
					message.channel.send("The game on this server has ended!")
				}
				else {
					message.channel.send("There's no game running!");
				}

			}


			else if(suffixes.suffix[1] == "truth") {

				if (todObj[guildID]) {

					console.log("Truth invoked");

					var playerList = [];
					for (i = 0; i < Object.keys(todObj[guildID].players).length; i++) {
						playerList.push(todObj[guildID].players[Object.keys(todObj[guildID].players)[i]]);
					}

					console.log("UserList: " + playerList);

					var truthObj = {
						sentences: {
							sfw: [
								{
									prefix:"Would you rather cover your entire face in ",
									mid: " or put a small amount of it onto your ",
									suffix: "?",
									wordsets: ['fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable'],
									wordsets2:['bodyparts']
								},
								{
									prefix:"Would you rather cover your entire face in ",
									mid: " or put a small amount of it into your ",
									suffix: "?",
									wordsets: ['fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable'],
									wordsets2:['orifices']
								},
								{
									prefix:"Would you rather give a random, awkwardly-long hug to your ",
									mid: " or kiss ",
									suffix: " on the lips?",
									wordsets: ['family'],
									wordsets2: ['players']
								},
								{
									prefix:"Are you gay?"
								}
							],
							nsfw: [
								{
									prefix:"Would you rather masturbate your ",
									mid: " or have penetrative sex with ",
									suffix: "?",
									wordsets: ['family'],
									wordsets2: ['players']
								},
								{
									prefix:"When did you last masturbate, and what to?~"
								}
							]
						},
						words: {
							nsfw: {
								bodyparts: ['genitals', 'ass', 'nipples'],
								appendages: ['penis/tits'],
								orifices: ['pussy', 'ass'],
								fluids: ['cum', 'lube'],
								drinks: ['alcohol'],
								foodsLiquid: ['soup', 'apple sauce', 'mustard', 'ketchup'],
								foodsSpreadable: ['butter', 'peanut butter', 'jelly', 'mayo'],
								family: ['mother','brother','father','sister','cousin','grandma','grandpa','family dog'],

								players: playerList
							},
							sfw: {
								bodyparts: ['arm', 'leg', 'nose', 'ear', 'elbow'],
								appendages: ['finger', 'hand', 'foot', 'toe', 'tongue'],
								orifices: ['nose', 'mouth', 'ear'],

								fluids: ['lotion', 'soap', 'water'],
								drinks: ['soda', 'water', 'juice', 'coffee'],

								foodsLiquid: ['soup', 'apple sauce', 'mustard', 'ketchup'],
								foodsSpreadable: ['butter', 'peanut butter', 'jelly', 'mayo'],
								family: ['mother','brother','father','sister','cousin','grandma','grandpa','family dog'],

								players: playerList

							}
						}
					}

					var truthString = "";

					var rndSRating = rndInt(0,1);
					var rndWRating = rndInt(0,1);

					if (rndSRating == 0) {
						rndSRating = 'sfw';
						console.log("SFW Sentence");
					}
					if (rndSRating == 1) {
						rndSRating = 'nsfw';
						console.log("NSFW Sentence");
					}

					if (rndWRating == 0) {
						rndWRating = 'sfw';
						console.log("SFW Wordsets");
					}
					if (rndWRating == 1) {
						rndWRating = 'nsfw';
						console.log("NSFW Wordsets");
					}

					var rndSentence = rndInt(0,(truthObj.sentences[rndSRating].length - 1));
					console.log("Sentence #" + rndSentence);

					truthString = truthObj.sentences[rndSRating][rndSentence].prefix;

					if (truthObj.sentences[rndSRating][rndSentence].mid) {

						var wordset1 = truthObj.sentences[rndSRating][rndSentence].wordsets[rndInt(0,(truthObj.sentences[rndSRating][rndSentence].wordsets.length -1))];
						console.log("set1: " + wordset1);
						var wordset2 = truthObj.sentences[rndSRating][rndSentence].wordsets2[rndInt(0,(truthObj.sentences[rndSRating][rndSentence].wordsets2.length -1))];
						console.log("set2: " + wordset2);
						var rndWord1 = rndInt(0,(truthObj.words[rndWRating][wordset1].length - 1));
						var rndWord2 = rndInt(0,(truthObj.words[rndWRating][wordset2].length - 1));
						truthString = truthString + truthObj.words[rndWRating][wordset1][rndWord1] + truthObj.sentences[rndSRating][rndSentence].mid + truthObj.words[rndWRating][wordset2][rndWord2] + truthObj.sentences[rndSRating][rndSentence].suffix;

					}

					else if (truthObj.sentences[rndSRating][rndSentence].suffix) {

						var wordset1 = truthObj.sentences[rndSRating][rndSentence].wordsets[rndInt(0,(truthObj.sentences[rndSRating][rndSentence].wordsets.length -1))];
						var rndWord1 = rndInt(0,(truthObj.words[rndWRating][wordset1].length - 1));
						truthString = truthString + truthObj.words[rndWRating][wordset1][rndWord1] + truthObj.sentences[rndSRating][rndSentence].suffix;

					}

					console.log(truthString);
					message.channel.send(truthString);


				}
				else {
					message.channel.send("There has to be a game running in this server to use this! That's pretty gay!");
				}

			}


			else if(suffixes.suffix[1] == "dare") {

				if (todObj[guildID]) {

					console.log("Dare invoked");

					var dareObj = {
						sentences: {
							sfw: [
								{
									prefix:"Stick your ",
									mid: " into a cup of ",
									suffix: ".",
									wordsets: ["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts'],
									wordsets2:["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Lick your ",
									mid:" or lather it in ",
									suffix:".",
									wordsets:["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts'],
									wordsets2:["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Eat some ",
									mid:" or throw it at ",
									suffix:".",
									wordsets:["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts'],
									wordsets2:["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Drink a full cup of ",
									suffix: ".",
									wordsets: ["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Pet your ",
									mid:" or kick your ",
									suffix:".",
									wordsets:["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts'],
									wordsets2:["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Gently insert ",
									mid:" into your ",
									suffix:".",
									wordsets:["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts'],
									wordsets2:["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Sit on your ",
									suffix: ".",
									wordsets: ["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Stick a finger into your ",
									suffix: ".",
									wordsets: ["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Try to snuggle your ",
									suffix: ".",
									wordsets: ["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Post your browser history."
								}
							],
							nsfw: [
								{
									prefix:"Cum on/in your ",
									suffix: ".",
									wordsets: ["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Cum on/in ",
									suffix: ".",
									wordsets: ["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Grind against your ",
									suffix: ".",
									wordsets: ["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Masturbate with ",
									suffix: ".",
									wordsets: ["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Suck off your ",
									suffix: ".",
									wordsets: ["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Gently masturbate your ",
									suffix: ".",
									wordsets: ["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								},
								{
									prefix:"Speak in ",
									suffix: " for "+ rndInt(1,24) +" hours.",
									wordsets: ["emotes", 'appendages', 'family', 'fluids', 'drinks', 'foodsLiquid', 'foodsSpreadable', 'orifices', 'bodyparts']
								}
							]
						},
						words: {
							nsfw: {
								bodyparts: ['genitals', 'ass', 'nipple'],
								appendages: ['penis/tits'],
								orifices: ['pussy', 'ass', 'urethra'],
								fluids: ['cum', 'lube', 'blood'],
								drinks: ['alcohol'],
								foodsLiquid: ['soup', 'apple sauce', 'mustard', 'ketchup'],
								foodsSpreadable: ['butter', 'peanut butter', 'jelly', 'mayo'],
								family: ['mother','brother','father','sister','cousin','grandma','grandpa','family dog'],
								emotes: ['owo', 'OwO', 'uwu', ">w<"]
							},
							sfw: {
								bodyparts: ['arm', 'leg', 'nose', 'ear', 'elbow'],
								appendages: ['finger', 'hand', 'foot', 'toe', 'tongue'],
								orifices: ['nose', 'mouth', 'ear', 'nostril'],

								fluids: ['lotion', 'soap', 'water', 'tide pods'],
								drinks: ['soda', 'water', 'juice', 'coffee'],

								foodsLiquid: ['soup', 'apple sauce', 'mustard', 'ketchup'],
								foodsSpreadable: ['butter', 'peanut butter', 'jelly', 'mayo'],
								family: ['mother','brother','father','sister','cousin','grandma','grandpa','family dog'],
								emotes: ['owo', 'OwO', 'uwu', ">w<"]

							}
						}
					}

					var dareString = "";

					var rndSRating = rndInt(0,1);
					var rndWRating = rndInt(0,1);

					if (rndSRating == 0) {
						rndSRating = 'sfw';
						console.log("SFW Sentence");
					}
					if (rndSRating == 1) {
						rndSRating = 'nsfw';
						console.log("NSFW Sentence");
					}

					if (rndWRating == 0) {
						rndWRating = 'sfw';
						console.log("SFW Wordsets");
					}
					if (rndWRating == 1) {
						rndWRating = 'nsfw';
						console.log("NSFW Wordsets");
					}

					var rndSentence = rndInt(0,(dareObj.sentences[rndSRating].length - 1));
					console.log("Sentence #" + rndSentence);

					dareString = dareObj.sentences[rndSRating][rndSentence].prefix;

					if (dareObj.sentences[rndSRating][rndSentence].mid) {

						var wordset1 = dareObj.sentences[rndSRating][rndSentence].wordsets[rndInt(0,(dareObj.sentences[rndSRating][rndSentence].wordsets.length -1))];
						var wordset2 = dareObj.sentences[rndSRating][rndSentence].wordsets2[rndInt(0,(dareObj.sentences[rndSRating][rndSentence].wordsets2.length -1))];
						var rndWord1 = rndInt(0,(dareObj.words[rndWRating][wordset1].length - 1));
						var rndWord2 = rndInt(0,(dareObj.words[rndWRating][wordset2].length - 1));
						dareString = dareString + dareObj.words[rndWRating][wordset1][rndWord1] + dareObj.sentences[rndSRating][rndSentence].mid + dareObj.words[rndWRating][wordset2][rndWord2] + dareObj.sentences[rndSRating][rndSentence].suffix;

					}

					else if (dareObj.sentences[rndSRating][rndSentence].suffix) {

						var wordset1 = dareObj.sentences[rndSRating][rndSentence].wordsets[rndInt(0,(dareObj.sentences[rndSRating][rndSentence].wordsets.length -1))];
						var rndWord1 = rndInt(0,(dareObj.words[rndWRating][wordset1].length - 1));
						dareString = dareString + dareObj.words[rndWRating][wordset1][rndWord1] + dareObj.sentences[rndSRating][rndSentence].suffix;

					}

					console.log(dareString);
					message.channel.send(dareString);


				}
				else {
					message.channel.send("There has to be a game running in this server to use this! That's pretty gay!");
				}

			}

			else if(suffixes.suffix[1] == "debug") {
				console.log(todObj);
			}

			else {
				message.channel.send("That's not a valid command, silly.");
			}

		}

		else {

			message.channel.send("Were you hoping to have a private ToD session with me? I'm flattered! Sadly, I'm unable to partake; why not play a ToD game on a **server** with other people? Don't worry, I like watching~ ;3");

		}

	}
}




//admin commands


commands.shout = {
	name: "Shout",
	help: "I'll shout for you~! ;3",
	aliases: ['announce'],
	usage: "shout [channel] [string]",
	level: 3,
	fn: function (suffixes, message) {
		var channelID = suffixes.suffix[1];
		console.log("ID for shout: " + channelID);
		suffixes.suffixRaw.shift(); suffixes.suffixRaw.shift();
		if (suffixes.suffixRaw.join(' ').allTrim().substr(0,1) == clientInfo.cmdChar) {
			message.channel.send("While I enjoy touching myself, talking to myself just doesn't do it for me.");
		}
		else
			client.channels.get(channelID).send(suffixes.suffixRaw.join(' '));
	}
}


commands.message = {
	name: "Message",
	help: "Pretend you didn't see this...~",
	aliases: ['dm'],
	usage: "shout [channel] [string]",
	level: 3,
	fn: function (suffixes, message) {
		var userID = suffixes.suffix[1];
		console.log("ID for shout: " + userID);
		suffixes.suffixRaw.shift(); suffixes.suffixRaw.shift();

		client.users.get(userID).send(suffixes.suffixRaw.join(' '));
	}
}

commands.eval = {
	name: "eval",
	help: "Restricted.",
	aliases: [],
	usage: "Don't use this.",
	level: 5,
	fn: function (suffixes, message) {

		suffixes.suffixRaw.shift();
		var evalString = suffixes.suffixRaw.join(' ')

		message.channel.send("```" + eval(evalString) + "```");
	}
}

commands.kill = {
	name: "kill",
	help: "Restricted.",
	aliases: [],
	usage: "Kills the bot",
	level: 5,
	fn: function (suffixes, message) {
    client.destroy((err) => {
        console.log(err);
    });
	}
}

commands.say = {
	name: "Say",
	help: "I'll say whatever you order me to say~",
	aliases: ['mock', 'mimic', 'repeat'],
	usage: "say [string]",
	level: 0,
	fn: function (suffixes, message) {
		suffixes.suffixRaw.shift();
		if (suffixes.suffixRaw.join(' ').allTrim().substr(0,1) == clientInfo.cmdChar) {
			message.channel.send("While I enjoy touching myself, talking to myself just doesn't do it for me.");
		}
		else
			message.channel.send(suffixes.suffixRaw.join(' ')+"\n`From " + message.author.username + "`" );
	}
}


commands.info = {
	name: "info",
	help: "Get to know me a little better~ ;3",
	aliases: ['i'],
	usage: "info",
	level: 0,
	fn: function (suffixes, message) {
		var currentTime = new Date();
		var uptime = currentTime - clientInfo.started;

		var uptimeS = Math.round((uptime/1000)%60);
		var uptimeM = Math.round((uptime/(1000*60))%60);
		var uptimeH = Math.round((uptime/(1000*60*60))%24);
		var uptimeD = Math.round((uptime/(1000*60*60*24)));

		cmdCount = Object.keys(commands).length;

		var text =
		  "**" + clientInfo.version + "**\n" +
		  "**Uptime:** `" + uptimeD + " Days` `" + uptimeH + " Hours` `" + uptimeM + " Minutes` `" + uptimeS + " Seconds`\n" +
		  "**Commands:** " + cmdCount;


		embedify(message.channel, {description: text}, "standard");
	}
}

commands.embed = {
	name: "embed",
	help: "Embed stuff",
	aliases: [],
	usage: "embed title body color footer",
	level: 0,
	fn: function (suffixes, message) {

		var embed = {}

		if (suffixes.suffixRaw[1]) {
			embed.title = suffixes.suffixRaw[1];
		}
		if (suffixes.suffixRaw[2]) {
			suffixes.suffixRaw.shift(); suffixes.suffixRaw.shift();
			var desc = suffixes.suffixRaw.join(' ')
			embed.description = desc;
		}
		embed.color = 0xe91e63;


		embedify(message.channel, embed);

	}
}











/*
embedify(message.channel, {author: {name: "Welcome"},color: 0xFF88FF,description: "Thanks for joining! This is a small, friendly server for Rain World art, roleplays, RPGs, and quests. Please read below for important information."});

embedify(message.channel, {author: {name: "Rules"},color: 0xFF44FF,description: "**1.** Treat everyone with respect.\n**2.** Stay on-topic to the channel you're in. *Do not chatter in RP or RPG channels -- use their respective discussion channels. Try to keep chatter to a minimum in Quest channels.*"});

embedify(message.channel, {author: {name: "Access"},color: 0xFF00FF,description: "This server has many channels, seperated into categories. If you can only see #announcements and #general, please ask a GM to verify you. If you're verified and see more channels, but don't see channel categories, please ensure that you're Discord is up to date.\nThis server also has NSFW channel categories. To see them, please request the @Lewd role from a GM. __By requesting this role, and by entering any NSFW channels, you verify that you are permitted to see sexual content by your country's laws, and waive the owners of this server of any liabilities should you be found to be breaking those laws.__"});

*/




/*
Check Discord Status
*/







/*
=============
AI Functions
=============
*/


function AIhandler(message) {
	var suffixRaw = message.content.split(' ');
	var suffix = message.content.toLowerCase().replace(/[^0-9a-z ]/gi, '').split(' ');
	var suffixNum = message.content.toLowerCase().replace(/[^0-9 ]/gi, '').split(' ');

	console.log(suffix);


	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '1ECD763B8E',
	  database : 'sys'
	});

	connection.connect(function(err) {
	  if (err) {
		console.error('error connecting: ' + err.stack);
		sendMessages('113116465065897984', ["**MySQL FATAL ERROR in AISQL -- ERROR CONNECTING**"]);
		sendMessages('113116465065897984', ["```"+err.stack.toString()+"```"]);
		sendMessages(channelID, ["A fatal SQL error has occurred during AI handling. <@113116465065897984> has been notified."]);
		return;
	  }

	  //console.log('connected as id ' + connection.threadId);
	});


	if (type == "listAI") {
		if (message == "strings") {
			connection.query(
				"SELECT msgStr, resIntent FROM AISTRINGS ORDER BY ID DESC;",
			   function (error, results) {
				if (error) {
					console.log("AI LIST STR -- ERROR");
					console.error(error);
					sendMessages(channelID, ["There was an SQL error within the AI Handler.```" + error.toString() + "```"]);
					sendMessages('113116465065897984', ["AISQL GET STR ERROR: "]);
					sendMessages('113116465065897984', ["```"+error.toString()+"```"]);
				}
				if (results) {
					console.log("AI LIST STR -- SUCCESS");
					var resArr = [];
					for (int = 0; int < Object.keys(results).length; int = int + 15) {
						var Size = resArr.length;
						var endSize = int + 15;
						resArr[Size] = '```json\n' + JSON.stringify(results.slice(int, endSize), null, 2) + '```';
					}
					sendMessages(channelID, resArr);
					}
				connection.end();
			});
		}
		if (message == "replies") {
			connection.query(
				"SELECT resStr, msgIntent FROM AIRESPONSES ORDER BY ID DESC;",
			   function (error, results) {
				if (error) {
					console.log("AI LIST REPLY -- ERROR");
					console.error(error);
					sendMessages(channelID, ["There was an SQL error within the AI Handler.```" + error.toString() + "```"]);
					sendMessages('113116465065897984', ["AISQL GET STR ERROR: "]);
					sendMessages('113116465065897984', ["```"+error.toString()+"```"]);
				}
				if (results) {
					console.log("AI LIST REPLY -- SUCCESS");
					var resArr = [];
					for (int = 0; int < Object.keys(results).length; int = int + 15) {
						var Size = resArr.length;
						var endSize = int + 15;
						resArr[Size] = '```json\n' + JSON.stringify(results.slice(int, endSize), null, 2) + '```';
					}
					sendMessages(channelID, resArr);
				}
				connection.end();
			});
		}
	}



	else {
		message.channel.send("I don't understand anything you're saying, but I appreciate the attention~");
	}

}
