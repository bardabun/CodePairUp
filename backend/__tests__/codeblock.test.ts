const supertest = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const CodeBlockTest = require('../models/codeblocks-model.js');

describe('codeblock', () =>{
  describe('get product route', () => {
    describe('given the product does not exist', () => {
      it('should return a 404', async () => {
        const codeblockId = '5'
        await supertest(app).get(`/api/codeblock/${codeblockId}`).expect(404);
      })
    })
  })
})

describe('CodeBlock API', () => {
  beforeAll(async () => {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Close the MongoDB connection
    await mongoose.connection.close();
  });
  describe('get product route', () => {
    describe('given the product do exist', () => {
      it('should return a code block by ID', async () => {
        // Retrieve the existing code block by ID
        const existingCodeBlock = await CodeBlockTest.findOne({ id: '4' });

        // Make a request to retrieve the code block
        const response = await supertest(app).get(`/api/codeblocks/${existingCodeBlock.id}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('codeBlock');
        expect(response.body.codeBlock.id).toBe(existingCodeBlock.id);
        expect(response.body.codeBlock.title).toBe(existingCodeBlock.title);
        expect(response.body.codeBlock.code).toBe(existingCodeBlock.code);
        expect(response.body.codeBlock.solution).toBe(existingCodeBlock.solution);
      });

      // it('should return 404 if the code block does not exist', async () => {
      //   const response = await supertest(app).get('/api/codeblocks/999');

      //   expect(response.status).toBe(404);
      // });
    });
  });
});