import NextImage from "next/image";

// A loader function that will be assigned only when running in storybook
// When running in storybook, the raw unoptimized image is used
let loader = process.env.STORYBOOK_ACTIVE && (({ src }) => src);

/**
 * We use NextJS image component.
 * This automatically optimize images for different devices.
 *
 * https://nextjs.org/docs/api-reference/next/image
 * @param {Object} props
 */
export default function Image(props) {
  console.log("image props", props);
  return <NextImage loader={loader} {...props} />;
}
