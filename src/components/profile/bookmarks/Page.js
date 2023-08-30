import useBookmarks from "@/components/hooks/useBookmarks";

const BookmarkPage = () => {
  const bookmarks = useBookmarks();

  console.log(bookmarks);
  return (<div>husk</div>);
}

export default BookmarkPage;