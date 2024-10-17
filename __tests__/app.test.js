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
          expect(Object.keys(article).length).toBe(8);
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.topic).toBe("mitch");
          expect(article.author).toBe("butter_bridge");
          expect(article.body).toBe("I find this existence challenging");
          expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(article.votes).toBe(100);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
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
    it("responds 200 - returns an array of article objects with all article properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
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
          expect(articles.length).toBe(12);
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
  });
  describe("/api/articles/:article_id/comments", () => {
    it("responds 200 - returns an array of comment objects with correct properties for the given article id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(11);
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
});
