import axios from "axios";

axios
  .post("http://localhost:8000/fast-app/fb3/posts", {
    title: "test title 1",
    description: "lorem ipsum",
  })
  .then(({ data }) => console.log(data))
  .catch(console.log);

axios
  .post("http://localhost:8000/fast-app/fb3/posts", {
    title: "test title 2",
    description: "lorem ipsum",
  })
  .then(({ data }) => console.log(data))
  .catch(console.log);

axios
  .post("http://localhost:8000/fast-app/fb3/posts", {
    title: "test title 3",
    description: "lorem ipsum",
  })
  .then(({ data }) => console.log(data))
  .catch(console.log);
