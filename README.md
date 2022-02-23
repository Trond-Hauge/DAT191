# Website for HEQED - Health Equality for a Sustainable Society through Education

This is a bachelor project at Western Norway University of Applied Sciences (HVL) in Computer Science. As per 22nd of February, it's still very much work in progress.

The website uses the framework Next.js, together with PostgreSQL as database. The authentication is build on JWT, stored in a cookie to let the user browse without frequently having to logging in. User may, of course, log out if wanted.

Further work beyond the website is making a virtual meeting application, meant to be implemented on the Streaming page, which is hinted to in the image under "Home Page" below. The virtual application will be made with Unreal Engine. If Pixel Streaming is implemented, it will be streamed from a cloud computer, and may allow photo realistic, virtually no matter what device the user is on.

Made by:
- Oliver Abraham O'Loughlin
- Lars Emil Bjørnsen Norevik
- Trond Hauge

### Home Page
![Index page](https://github.com/h586634/DAT191/blob/main/public/Index.jpg?raw=true)

### Library Page
The library utilizes client side rendering, with lightweight prefetching of documents let the user get realtime search results in the side menu. The search is copied over to the URL to let the user easily share the result.
![Library page](https://github.com/h586634/DAT191/blob/main/public/Library_Default.jpg?raw=true)

![Library page with search](https://github.com/h586634/DAT191/blob/main/public/Library_Search.jpg?raw=true)

### Document Page

![Index page](https://github.com/h586634/DAT191/blob/main/public/Document.jpg?raw=true)

### To dos
- Polish usability and uploading tools
- Finish login, and ensure safety in database and cookie/ JWT.
- Continue ensuring that the server load is as little as possible
- Finish administration tools for professional users
