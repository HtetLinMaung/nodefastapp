import axios from "axios";

axios
  .post("http://localhost:8000/fast-app/social-media/posts", {
    title: "test title",
    description: "lorem ipsum",
    comments: [
      {
        description: "hello",
      },
      {
        description: "hi",
      },
    ],
  })
  .then(({ data }) => console.log(data))
  .catch(console.log);
