/**
 * Body parse search-and-replace funtion
 *
 * @param {string} str
 *
 * @returns {string}
 */
export default function parseArticleBody(str) {
  const img_regex = /<\s*img[^>]*\/>/g;
  const cap_regex = /data-caption=\"(.*?)\"/;
  const src_regex = /src=\"(.*?)\"/;
  const alt_regex = /alt=\"(.*?)\"/;

  // quick fix bug - BIBDK2021-1059 .. moved to new namespace (febib) ..
  // but images from drupal has an absolute url .. to the old namespace
  // @TODO better fix
  const regex =
    /http:\/\/bibdk-backend-www-master\.frontend-prod\.svc\.cloud\.dbc\.dk\//g;
  let newstr;

  newstr = str.replace(
    regex,
    "http://bibdk-backend-www-master.febib-prod.svc.cloud.dbc.dk/"
  );

  const img = newstr.match(img_regex);

  img &&
    img.map((img) => {
      if (img) {
        const caption = img.match(cap_regex);
        const src = img.match(src_regex);

        const alt = img.match(alt_regex);

        // Set image src
        let modified_src = src && src[1];
        if (src && !process.env.STORYBOOK_ACTIVE) {
          modified_src = `/_next/image?url=${modified_src}&w=1920&q=75`;
        }

        // Create new image element
        const modified_img = `<img src="${modified_src}" alt="${
          (alt && alt[1]) || ""
        }" title="${(caption && caption[1]) || ""}">`;

        // set caption
        let captionEl = "";
        if (caption && caption[1]) {
          captionEl = `<figcaption>${caption[1]}</figcaption>`;
        }

        // replace elements
        const newEl = `<figure> ${modified_img} ${
          captionEl && captionEl
        }</figure>`;
        newstr = newstr.replace(img, newEl);
      }
    });

  return newstr;
}
