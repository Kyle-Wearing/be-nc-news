const app = require("../app/app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const endpointsJSON = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET requests", () => {
  describe("/api", () => {
    it("responds 200 - returns the endpoints json", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(endpoints).toEqual(endpointsJSON);
        });
    });
  });
  describe("/api/users", () => {
    it("responds 200 - returns an array of user objects with all user properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });
        });
    });
  });
  describe("/api/users/:username", () => {
    it("responds 200 - returns the user object that matches the request username", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user.username).toBe("icellusedkars");
          expect(user.name).toBe("sam");
          expect(user.avatar_url).toBe(
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
          );
        });
    });
    it("responds 404 - returns an error message user does not exist if given a username that doesnt exist", () => {
      return request(app)
        .get("/api/users/non-existant-user")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("User does not exist");
        });
    });
  });
  describe("/api/topics", () => {
    it("responds 200 - returns an array of topic objects with the properties, slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
  });
  describe("/api/articles/:rticle_id", () => {
    it("responds 200 - returns an article object with all the article properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.topic).toBe("mitch");
          expect(article.author).toBe("butter_bridge");
          expect(article.body).toBe("I find this existence challenging");
          expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(article.votes).toBe(100);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
          expect(article.comment_count).toBe(11);
        });
    });
    it("responds 404 - returns an error message if given a valid id that does not exist", () => {
      return request(app)
        .get("/api/articles/9999999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article does not exist");
        });
    });
    it("responds 400 - return an error message if given an invalid id type", () => {
      return request(app)
        .get("/api/articles/invalid_id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid id type");
        });
    });
  });
  describe("/api/articles", () => {
    it("responds 200 - returns an array of article objects with all article properties defaults to 10 articles long", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(10);
          articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });
    it("should order the articles by date in descending order by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({ key: "created_at", descending: true });
        });
    });
    it("should order the articles by article id if given a sort by query of article_id", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({ key: "article_id", descending: true });
        });
    });
    it("should order the articles by votes if given a sort by query of votes", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({ key: "votes", descending: true });
        });
    });
    it("should sort in ascending order if given order query asc", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({ key: "article_id", descending: false });
        });
    });
    it("should sort in descending order if given order query desc", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=desc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({ key: "article_id", descending: true });
        });
    });
    it("responds 400 - returns an error message 'invalid queries' if given a query that isnt greenlisted", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid_query")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid queries");
        });
    });
    it("responds 400 - returns an error message 'invalid queries' if given a query that isnt greenlisted", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=invalid_order")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid queries");
        });
    });
    it("responds 200 - returns all articles for a specified topic given as a topic query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(10);
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    it("responds 200 - returns an empty array if the queired topic exists but has no articles ", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(0);
        });
    });
    it("responds 404 - returns an error message if the queired topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=invalid_topic")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Topic does not exist");
        });
    });
    it("responds 200 - returns an array of article of a given length via a limit query", () => {
      return request(app)
        .get("/api/articles?limit=5")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(5);
          articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });
    it("responds 400 - returns an error message if given an invalid limit query", () => {
      return request(app)
        .get("/api/articles?limit=invalid")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid id type");
        });
    });
    it("responds 200 - returns an array of articles starting from a given page", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=asc&limit=2&p=4")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].article_id).toBe(7);
          articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("responds 200 - returns an array of comment objects with correct properties for the given article id, defaults to 10 comments per page", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(10);
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
          });
        });
    });
    it("responds 404 - returns error message 'Article does not exist' when given a valid id that does not exist", () => {
      return request(app)
        .get("/api/articles/999999/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article does not exist");
        });
    });
    it("responds 400 - returns error message 'Invalid id type' when given an invalid id type", () => {
      return request(app)
        .get("/api/articles/invalid_id/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid id type");
        });
    });
    it("responds 200 - returns an empty array if given a valid id that exists but has no comments", () => {
      return request(app)
        .get("/api/articles/7/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
    it("responds 200 - returns an array of comment objects, and only returns given ammount of comments specified via query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(5);
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
          });
        });
    });
    it("responds 400 - returns an error message if given an invalid limit type", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=invalid")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid id type");
        });
    });
    it("responds 200 - returns an array of comment objects, and only returns given ammount of comments specified via query starting at a given page via query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=2&p=3")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments[0].comment_id).toBe(6);
          expect(comments.length).toBe(2);
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
          });
        });
    });
    it("responds 400 - returns an error message if given page query is invalid type", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5&p=invalid")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid id type");
        });
    });
  });
});

describe("POST requests", () => {
  describe("/api/articles/:article_id/comments", () => {
    it("responds 201 - returns a newly posted comment object", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "butter_bridge", body: "new comment" })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment.article_id).toBe(2);
          expect(comment.body).toBe("new comment");
          expect(comment.author).toBe("butter_bridge");
          expect(comment.votes).toBe(0);
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.comment_id).toBe("number");
        });
    });
    it("responds 400 - returns an error message if the sent request body doesnt have a body ", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "butter_bridge" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid comment contents");
        });
    });
    it("responds 400 - returns an error message if the sent request body doesnt have a username ", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ body: "New comment" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid comment contents");
        });
    });
    it("responds 404 - returns an error message if the comment is trying to be posted to an article that does not exist", () => {
      return request(app)
        .post("/api/articles/99999/comments")
        .send({ username: "butter_bridge", body: "new comment" })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article does not exist");
        });
    });
    it("responds 400 - returns an error message if the comment is being posted to an invalid id type", () => {
      return request(app)
        .post("/api/articles/invalid_id/comments")
        .send({ username: "butter_bridge", body: "new comment" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid id type");
        });
    });
    it("responds 404 - returns an error message if the username in the comment is for a user that does not exist", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "non-existant_user", body: "new comment" })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("User does not exist");
        });
    });
  });
  describe("/api/articles", () => {
    it("responds 201 - returns a newly created article object with all article properties ", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "butter_bridge",
          title: "new title",
          body: "new body",
          topic: "cats",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        })
        .expect(201)
        .then(({ body: { article } }) => {
          expect(article.author).toBe("butter_bridge");
          expect(article.title).toBe("new title");
          expect(article.body).toBe("new body");
          expect(article.topic).toBe("cats");
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.created_at).toBe("string");
          expect(article.votes).toBe(0);
          expect(article.comment_count).toBe(0);
        });
    });
    it("responds 201 - returns a newly created article object with the img url set to a default if it is not given", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "butter_bridge",
          title: "new title",
          body: "new body",
          topic: "cats",
        })
        .expect(201)
        .then(({ body: { article } }) => {
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
          );
        });
    });
    it("responds 400 - returns an error message if author is not given", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "new title",
          body: "new body",
          topic: "cats",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid request body");
        });
    });
    it("responds 400 - returns an error message if title is not given", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "butter_bridge",
          body: "new body",
          topic: "cats",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid request body");
        });
    });
    it("responds 400 - returns an error message if body is not given", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "butter_bridge",
          title: "new title",
          topic: "cats",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid request body");
        });
    });
    it("responds 400 - returns an error message if topic is not given", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "butter_bridge",
          title: "new title",
          body: "new body",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid request body");
        });
    });
    it("responds 404 - if the given topic does not exist", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "butter_bridge",
          title: "new title",
          body: "new body",
          topic: "does not exist",
        })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Topic does not exist");
        });
    });
    it("responds 404 - if the given user does not exist", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "not a user",
          title: "new title",
          body: "new body",
          topic: "cats",
        })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("User does not exist");
        });
    });
  });
  describe("/api/topics", () => {
    it("responds 201 - returns a newly created topic object with correct properties", () => {
      return request(app)
        .post("/api/topics")
        .send({ slug: "new topic", description: "description of new topic" })
        .expect(201)
        .then(({ body: { topic } }) => {
          expect(topic.slug).toBe("new topic");
          expect(topic.description).toBe("description of new topic");
        });
    });
    it("responds 400 - returns an error message if request body is missing slug", () => {
      return request(app)
        .post("/api/topics")
        .send({ description: "description of new topic" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid request body");
        });
    });
    it("responds 400 - returns an error message if topic being created already exists", () => {
      return request(app)
        .post("/api/topics")
        .send({ slug: "cats", description: "description of new topic" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Already exists");
        });
    });
  });
  describe("/api/users", () => {
    it("responds 201 - returns a newly created user object and url should use default", () => {
      return request(app)
        .post("/api/users")
        .send({ username: "test_username", name: "test name" })
        .expect(201)
        .then(({ body: { user } }) => {
          expect(user.username).toBe("test_username");
          expect(user.name).toBe("test name");
          expect(user.avatar_url).toBe(
            "https://cdn-icons-png.flaticon.com/512/10398/10398223.png"
          );
        });
    });
    it("responds 400 - returns an error message is a user is being posted with an already existing username", () => {
      return request(app)
        .post("/api/users")
        .send({ username: "butter_bridge", name: "test name" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Already exists");
        });
    });
  });
});

describe("PATCH requests", () => {
  describe("/api/articles/:article_id", () => {
    it("responds 200 - returns the article with the number of votes changed by ammount specified in body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 100 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(Object.keys(article).length).toBe(8);
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.topic).toBe("mitch");
          expect(article.author).toBe("butter_bridge");
          expect(article.body).toBe("I find this existence challenging");
          expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(article.votes).toBe(200);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    it("reponds 404 - returns an arror message 'Article does not exist' if passed a valid article id type that does not exist", () => {
      return request(app)
        .patch("/api/articles/999999")
        .send({ inc_votes: 100 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article does not exist");
        });
    });
    it("responds 400 - returns an error message if the request body doesnt have an inc_votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid request body");
        });
    });
    it("responds 400 - returns an error message if the article id is an invalid type", () => {
      return request(app)
        .patch("/api/articles/invalid_id")
        .send({ inc_votes: 100 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid id type");
        });
    });
  });
  describe("/api/comments/:comment_id", () => {
    it("responds 200 - returns the comment with the number of votes changed by ammount specified in body", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 100 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).toBe(116);
          expect(comment.comment_id).toBe(1);
        });
    });
    it("responds 404 - returns an error message 'comment does not exist' when given a valid comment id that doesnt exist", () => {
      return request(app)
        .patch("/api/comments/99999")
        .send({ inc_votes: 100 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Comment does not exist");
        });
    });
    it("responds 400 - returns an error message 'invalid id type' when given a invalid comment id type", () => {
      return request(app)
        .patch("/api/comments/invalid_id")
        .send({ inc_votes: 100 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid id type");
        });
    });
    it("responds 400 - returns an error message 'invalid request body' if request body does not include inc_votes", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid request body");
        });
    });
    it("responds 400 - returns an error message 'invalid inc_votes type' if request body includes inc_votes as an invalid data type", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "invalid_data_type" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid inc_votes type");
        });
    });
  });
});

describe("DELETE requests", () => {
  describe("/api/comments/:comment_id", () => {
    it("responds 204 - does not return a body", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return request(app).get("/api/comments/1").expect(404);
        });
    });
    it("responds 404 - if given comment id is valid type but does not exist", () => {
      return request(app)
        .delete("/api/comments/999999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Comment does not exist");
        });
    });
    it("responds 400 - if given an invalid comment id type", () => {
      return request(app)
        .delete("/api/comments/invalid_id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid id type");
        });
    });
  });
  describe("/api/article/:article_id", () => {
    it("responds 204 - does not send anything back", () => {
      return request(app)
        .delete("/api/articles/2")
        .expect(204)
        .then(() => {
          return request(app)
            .get("/api/articles/2")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Article does not exist");
            });
        });
    });
    it("responds 404 - returns an error message if the article id is a valid type but does not exist", () => {
      return request(app)
        .delete("/api/articles/9999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article does not exist");
        });
    });
    it("responds 400 - returns an error message if the article id is an invalid type", () => {
      return request(app)
        .delete("/api/articles/invalid_id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid id type");
        });
    });
  });
});
