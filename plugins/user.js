/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2023 Loki - Xer.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Jarvis - Loki-Xer 


------------------------------------------------------------------------------------------------------------------------------------------------------*/

const {
	System,
	parsedJid,
	isAdmin,
	updateProfilePicture,
} = require("../lib");
const {exec} = require("child_process");
const { WarnDB } = require("../lib/database");
const { WARN_COUNT } = require("../config");
const { saveWarn, resetWarn } = WarnDB;


System({
	pattern: "setpp",
	fromMe: true,
	desc: "Set profile picture",
	type: "user",
}, async (message, match, m) => {
	if (!message.reply_message.image)
	return await message.reply("_Reply to a photo_");
	let buff = await message.reply_message.download();
	await message.setPP(message.user.jid, buff);
	return await message.reply("_Profile Picture Updated_");
});

System({
	pattern: "jid",
	fromMe: true,
	desc: "Give jid of chat/user",
	type: "user",
}, async (message, match) => {
	return await message.send( message.mention.jid?.[0] || message.reply_message.jid || message.jid);
});

System({
	pattern: "pp$",
	fromMe: true,
	desc: "Set full screen profile picture",
	type: "user",
}, async (message, match) => {
	if (!message.reply_message.image)
	return await message.reply("_Reply to a photo_");
	let media = await message.reply_message.download();
	await updateProfilePicture(media, message, message.user.jid);
	return await message.reply("_Profile Picture Updated_");
});

System({
	pattern: "reboot",
	fromMe: true,
	desc: "to reboot your bot",
	type: "user",
}, async (message, match, m) => {
    await message.reply('_Rebooting..._')
    require('pm2').restart('index.js');
});

System({
    pattern: "dlt",
    fromMe: true,
    desc: "deletes a message",
    type: "user",
}, async (message) => {
    await message.client.sendMessage(message.chat, { delete: message.reply_message });
});


System({
    pattern: "privacy",
    fromMe: true,
    desc: "To change privacy of WhatsApp",
    type: "user"
}, async (message, match) => {
    let responseMessage;

    switch (match) {
        case "lastseenEveryone":
            await message.updateLastSeen("all");
            responseMessage = "_*Last seen privacy updated to everyone*_";
            break;
        case "lastseenNobody":
            await message.updateLastSeen("none");
            responseMessage = "_*Last seen privacy updated to nobody*_";
            break;
        case "lastseenMyContactsExcept":
            await message.updateLastSeen("contact_blacklist");
            responseMessage = "_*Last seen privacy updated to my contacts except*_";
            break;
        case "lastseenMyContacts":
            await message.updateLastSeen("contacts");
            responseMessage = "_*Last seen privacy updated to my contacts*_";
            break;
        case "lastseen":
            await message.sendPollMessage({ name: "\nChoose one to update last seen privacy\n", values: [{"everyone", "privacy lastseenEveryone"}, {"nobody", "privacy lastseenNobody"}, {"my contacts except", "privacy lastseenMyContactsExcept"}, {"my contacts", "privacy lastseenMyContacts"}, {"Online privacy", "Onlineprivacy"}, {"home", "privacy"}], withPrefix: true, participates: [message.sender] });
            return;
        case "ppsettingsEveryone":
            await message.updatePpSettings("all");
            responseMessage = "_*Profile picture privacy updated to everyone*_";
            break;
        case "ppsettingsNobody":
            await message.updatePpSettings("none");
            responseMessage = "_*Profile picture privacy updated to nobody*_";
            break;
        case "ppsettingsContactsExcept":
            await message.updatePpSettings("contact_blacklist");
            responseMessage = "_*Profile picture privacy updated to my contacts except*_";
            break;
        case "ppsettingsContacts":
            await message.updatePpSettings("contacts");
            responseMessage = "_*Profile picture privacy updated to my contacts*_";
            break;
        case "ppsettings":
            await message.sendPollMessage({ name: "\nChoose one to update profile picture privacy", values: [{"everyone", "privacy ppsettingsEveryone"}, {"nobody", "privacy ppsettingsNobody"}, {"my contacts except", "privacy ppsettingsContactsExcept"}, {"my contacts", "privacy ppsettingsContacts"}, {"home", "privacy"}], withPrefix: true, participates: [message.sender] });
            return;
        case "statusPrivacyEveryone":
            await message.updateStatusPrivacy("all");
            responseMessage = "_*Status privacy updated to everyone*_";
            break;
        case "statusPrivacyNobody":
            await message.updateStatusPrivacy("none");
            responseMessage = "_*Status privacy updated to nobody*_";
            break;
        case "statusPrivacyMyContactsExcept":
            await message.updateStatusPrivacy("contact_blacklist");
            responseMessage = "_*Status privacy updated to my contacts except*_";
            break;
        case "statusPrivacyMyContacts":
            await message.updateStatusPrivacy("contacts");
            responseMessage = "_*Status privacy updated to my contacts*_";
            break;
        case "statusPrivacy":
            await message.sendPollMessage({ name: "Choose one to update status privacy\n", values: [{"everyone", "privacy statusPrivacyEveryone"}, {"nobody", "privacy statusPrivacyNobody"}, {"my contacts except", "privacy statusPrivacyMyContactsExcept"}, {"my contacts", "privacy statusPrivacyMyContacts"}, {"home", "privacy"}], withPrefix: true, participates: [message.sender] });
            return;
        case "ReadReceiptsprivacyNobody":
            await message.updateReadReceipts("none");
            responseMessage = "_*Read Receipts privacy updated to nobody*_";
            break;
        case "ReadReceiptsprivacyEveryone":
            await message.updateReadReceipts("all");
            responseMessage = "_*Read Receipts privacy updated to everyone*_";
            break;
        case "ReadReceiptsprivacy":
            await message.sendPollMessage({ name: "Choose one to update Read Receipts privacy\n", values: [{"everyone", "privacy ReadReceiptsprivacyEveryone"}, {"nobody", "privacy ReadReceiptsprivacyNobody"}, {"home", "privacy"}], withPrefix: true, participates: [message.sender] });
            return;
        case "GroupsAddprivacyEveryone":
            await message.groupsAddingPrivacy("all");
            responseMessage = "_*Groups Add privacy updated to everyone*_";
            break;
        case "GroupsAddprivacyNobody":
            await message.groupsAddingPrivacy("none");
            responseMessage = "_*Groups Add privacy updated to nobody*_";
            break;
        case "GroupsAddprivacyMyContactsExcept":
            await message.groupsAddingPrivacy("contact_blacklist");
            responseMessage = "_*Groups Add privacy updated to my contacts except*_";
            break;
        case "GroupsAddprivacyMyContacts":
            await message.groupsAddingPrivacy("contacts");
            responseMessage = "_*Groups Add privacy updated to my contacts*_";
            break;
        case "GroupsAddprivacy":
            await message.sendPollMessage({ name: "\nChoose one to update Groups Add privacy\n", values: [{"everyone", "privacy GroupsAddprivacyEveryone"}, {"nobody", "privacy GroupsAddprivacyNobody"}, {"my contacts except", "privacy GroupsAddprivacyMyContactsExcept"}, {"my contacts", "privacy GroupsAddprivacyMyContacts"}, {"home", "privacy"}], withPrefix: true, participates: [message.sender] });
            return;
        case "disappearingfirst":
            await message.updateDisappearingMsg("86400");
            responseMessage = "_*Disappearing Mode updated to 24 hour*_";
            break;
        case "disappearingtwos":
            await message.updateDisappearingMsg("604800");
            responseMessage = "_*Disappearing Mode updated to 7 days*_";
            break;
        case "disappearingoff":
            await message.updateDisappearingMsg("0");
            responseMessage = "_*Disappearing Mode off*_";
            break;
        case "disappearingnine":
            await message.updateDisappearingMsg("7776000");
            responseMessage = "_*Disappearing Mode updated to 90 days*_";
            break;
        case "disappearing":
            await message.sendPollMessage({ name: "\nChoose one to update disappearing message privacy\n", values: [{"24 hour", "privacy disappearingfirst"}, {"7 days", "privacy disappearingtwos"}, {"90 days", "privacy disappearingnine"}, {"off", "privacy disappearingoff"}, {"home", "privacy"}], withPrefix: true, participates: [message.sender] });
            return;
        case "Onlineprivacyall":
            await message.onlineLastSeen("all");
            responseMessage = "_*Online privacy updated to every one*_";
            break;
        case "OnlineprivacyMatchas":
            await message.onlineLastSeen("match_last_seen");
            responseMessage = "_*Online privacy updated to same as last seen*_";
            break;
        case "Onlineprivacy":
            await message.sendPollMessage({ name: "\nChoose one to update Online privacy settings\n", values: [{"everyone", "privacy Onlineprivacyall"}, {"same as last seen", "privacy OnlineprivacyMatchas"}, {"home", "privacy"}], withPrefix: true, participates: [message.sender] });
            return;
        case "mydatasettings":
            const { readreceipts, profile, status, online, last, groupadd, calladd } = await message.getSettings(message.user.id);
            const name = await message.getName(message.user.id);
            const cap = `*♺ My Privacy*\n\n*Name:* ${name}\n*Online:* ${online}\n*Profile:* ${profile}\n*Last Seen:* ${last}\n*Read Receipts:* ${readreceipts}\n*Group Add Settings:* ${groupadd}\n*Call Add Settings:* ${calladd}`;
            await message.client.sendMessage(message.chat, { image: { url: await message.getPP(message.jid) }, caption: cap });
            return;
        default:
            await message.sendPollMessage({ name: "\nChoose one setting to continue\n", values: [{"last seen privacy", "privacy lastseen"}, {"profile picture privacy", "privacy ppsettings"}, {"status privacy", "privacy statusPrivacy"}, {"Read Receipts privacy", "privacy ReadReceiptsprivacy"}, {"Groups Add privacy", "privacy GroupsAddprivacy"}, {"disappearing message settings", "privacy disappearing"}, {"Online privacy settings", "privacy Onlineprivacy"}, {"my settings", "privacy mydatasettings"}], withPrefix: true, participates: [message.sender] });
            return;
    }
    
    await message.send(responseMessage);
});
