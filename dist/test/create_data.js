"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
axios_1.default
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
//# sourceMappingURL=create_data.js.map