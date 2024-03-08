import noImage from "../assets/no-image-placeholder-6f3882e0.webp";
const getCroppedImageUrl = (url: string) => {
  // media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg
  // media.rawg.io/media/crop/600/400/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg
  if (!url) return noImage;
  const target = "media/";
  const index = url.indexOf(target) + target.length;
  return url.slice(0, index) + "crop/600/400/" + url.slice(index);
};

export default getCroppedImageUrl;
