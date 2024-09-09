const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);


let issue1; 
let issue2;

////////////////////// POST REQUEST TESTS //////////////////////

suite('Functional Tests', function() {
  suite('Routing test', function() {
    suite('3 POST request Tests', function(){
        test("Create an issue with every field: POST request to /api/issues/test123", function(done) {
            chai
                .request(server)
                .post('/api/issues/test123')
                .set("content-type", 'application/json')
                .send({
                    issue_title: "Issue 1",
                    issue_text: "Functional test",
                    created_by: "FCC",
                    assigned_to: "Dom", 
                    status_text: "Not Done" 
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    issue1 = res.body;
                    assert.equal(res.body.issue_title, "Issue 1");
                    assert.equal(res.body.assigned_to, "Dom");
                    assert.equal(res.body.created_by, "FCC");
                    assert.equal(res.body.status_text, "Not Done");
                    assert.equal(res.body.issue_text, "Functional test");
                    done();
                });
            }).timeout(10000);
        test("Create an issue with only required fields: POST request to /api/issues/test123", function(done) {
            chai
                .request(server)
                .post('/api/issues/test123')
                .set("content-type", "application/json")
                .send({
                    issue_title:"Issue 1",
                    issue_text: "Functional test",
                    created_by: "FCC",
                    assigned_to: "",
                    status_text: ""
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    issue2= res.body;
                    assert.equal(res.body.issue_title, "Issue 1");
                    assert.equal(res.body.created_by, "FCC" );
                    assert.equal(res.body.issue_text, "Functional test");
                    assert.equal(res.body.assigned_to, "");
                    assert.equal(res.body.status_text, "");
                    done()
                })
        }).timeout(5000);
        test("Create an issue with missing requires fields: POST request to /api/issues/test123", function(done) {
            chai
                .request(server)
                .post('/api/issues/test123')
                .set('content-type', 'application/json')
                .send({
                    issue_title: "",
                    issue_test: "",
                    created_by: "FCC",
                    assigned_to: "",
                    status_text: "",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "required field(s) missing");
                    done();
                })
        }).timeout(5000)
        })
    })

    ////////////////////// GET REQUEST TESTS //////////////////////

    suite("3 GET request tests", function () {
        test("View issues on a project: GET request to /api/issues/test123", function(done) {
            chai
                .request(server)
                .get('/api/issues/test123')
                .end(function(err, res) {
                    assert.equal(res.status, 200)
                    done();
                });
        });
        test("View issues on a project with one filter: GET request to /api/issues/test123", function(done) {
            chai
                .request(server)
                .get('/api/issues/test123')
                .query({
                    _id: issue1._id
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body[0].issue_title, issue1.issue_title);
                    assert.equal(res.body[0].issue_text, issue1.issue_text);
                    done();
                })
        });
        test("View issues on a project with multiple filters: GET request to /api/issues/test123", function(done) {
            chai
                .request(server)
                .get('/api/issues/test123')
                .query({
                    _id: issue1._id,
                    issue_title: issue1.issue_title,
                    issue_text: issue1.issue_text
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body[0]._id, issue1._id);
                    assert.equal(res.body[0].issue_title, issue1.issue_title);
                    assert.equal(res.body[0].issue_text, issue1.issue_text);
                    done();
                });
        });
    });

    ////////////////////// PUT REQUEST TESTS //////////////////////

    suite("5 PUT request Tests", function() {
        test("Update one field on an issue: PUT request to /api/issues/test123", function(done) {
            chai
                .request(server)
                .put('/api/issues/test123')
                .send({
                    _id: issue1._id,
                    issue_title: "different"
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully updated");
                    assert.equal(res.body._id, issue1._id);

                    done();
                })
        });
        test("Update multiple fields on an issue: PUT request to /api/issues/test123", function(done) {
            chai
                .request(server)
                .put('/api/issues/test123')
                .send({
                    _id: issue1._id,
                    issue_title: "different",
                    issue_text: "different",
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully updated");
                    assert.equal(res.body._id, issue1._id);

                    done();
                })

        });
        test("Update an issue with missing _id: PUT request to /api/issues/test123", function(done) {
            chai
                .request(server)
                .put('/api/issues/test123')
                .send({
                    issue_title: 'different',
                    issue_text: 'different',
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "missing _id");

                    done();
                })

        });
        test("Update an issue with no fields to update: PUT request to /api/issues/test123", function(done) {
            chai
                .request(server)
                .put('/api/issues/test123')
                .send({
                    _id: issue1._id
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "no update field(s) sent");

                    done();
                })

        });
        test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function(done) {
            chai
                .request(server)
                .put('/api/issues/test123')
                .send({
                    _id: "false",
                    issue_text: "nothing",
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "could not update");

                    done();
                })

        });
    });

    ////////////////////// DELETE REQUEST TESTS //////////////////////

    suite("3 DELETE request Tests", function() {
        test("Delete an issue: DELETE request to /api/issues/test123", function(done) {
            chai
                .request(server)
                .delete('/api/issues/test123')
                .send({
                    _id: issue1._id,
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully deleted")
                });
            chai
                .request(server)
                .delete('/api/issues/test123')
                .send({
                    _id: issue2._id,
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully deleted");
                });
            done();
        });
        test("Delete an issue with an invalid _id: DELETE request to /api/issues/test123", function(done) {
            chai
                .request(server)
                .delete('/api/issues/test123')
                .send({
                    _id: "fake",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'could not delete');

                    done();
                });   
        });
        test("Delete an issue with missing _id: DELETE request to /api/issues/test123", function(done) {
            chai
                .request(server)
                .delete('/api/issues/test123')
                .send({})
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "missing _id");

                    done();
                })
            
        })
    })
});




