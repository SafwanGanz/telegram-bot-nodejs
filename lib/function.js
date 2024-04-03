async function getArgs(ctx) {
    try {
      var args = ctx.message.text;
      args = args.split(" ");
      args.shift();
      return args;
    } catch {
      return [];
    }
  }

  function getUser(ctx) {
    try {
      var user = ctx;
      var last_name = user["last_name"] || "";
      var full_name = user.first_name + " " + last_name;
      user["full_name"] = full_name.trim();
      return user;
    } catch (e) {
      throw e;
    }
  }

  async function getBot(ctx) {
    try {
      var bot = ctx.botInfo;
      var last_name = bot["last_name"] || "";
      var full_name = bot.first_name + " " + last_name;
      bot["full_name"] = full_name.trim();
      return bot;
    } catch {
      return {};
    }
  }

  async function getLink(file_id) {
    try {
      return (await bot.telegram.getFileLink(file_id)).href;
    } catch {
      throw "Error while get url";
    }
  }

  async function getPhotoProfile(id) {
    try {
      var url_default =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
      if (String(id).startsWith("-100")) {
        var pp = await bot.telegram.getChat(id);
        if (!pp.hasOwnProperty("photo")) return url_default;
        var file_id = pp.photo.big_file_id;
      } else {
        var pp = await bot.telegram.getUserProfilePhotos(id);
        if (pp.total_count == 0) return url_default;
        var file_id = pp.photos[0][2].file_id;
      }
      return await getLink(file_id);
    } catch (e) {
      throw e;
    }
  }
  async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
module.exports = { 
    getArgs,
    getUser,
    getBot,
    getLink,
    getPhotoProfile,
    delay
}