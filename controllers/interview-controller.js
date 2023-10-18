const express = require("express");
const router = express.Router();
const { verifyToken, generateToken } = require("../middleware/auth.middleware");

let data = [];

/**
 * @swagger
 * /interview/getData:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of all users.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
 *         description: JWT token in the "Authorization" header.
 *     responses:
 *       200:
 *         description: A list of users.
 *     security:
 *       - JWT: []  # This associates the '/interview/getData' endpoint with the 'JWT' security definition.
 */
router.get("/getData", verifyToken, (req, res) => {
  res.send(data);
});

/**
 * @swagger
 * /interview/addData:
 *   post:
 *     summary: Add a user's data
 *     description: Add a new user with name and designation.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: User's new designation.
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *              type: string
 *              required: true
 *             designation:
 *               type: string
 *               required: true
 *     responses:
 *       200:
 *         description: User data added successfully.
 *     security:
 *       - JWT: []  # This associates the '/interview/addData' endpoint with the 'JWT' security definition.
 */
router.post("/addData", (req, res) => {
  const { name, designation } = req.body;
  data.push({
    name,
    designation,
  });
  const token = generateToken(name);
  res.send({ token });
});


/**
 * @swagger
 * /interview/updateData:
 *   put:
 *     summary: Update a user's designation
 *     description: Update the designation of a user.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
 *         description: JWT token in the "Authorization" header.
 *       - in: body
 *         name: body
 *         required: true
 *         description: User's new designation.
 *         schema:
 *           type: object
 *           properties:
 *             designation:
 *               type: string
 *     responses:
 *       200:
 *         description: User's designation updated successfully.
 *       404:
 *         description: User not found.
 *     security:
 *       - JWT: []  # This associates the '/interview/updateData' endpoint with the 'JWT' security definition.
 */
router.put("/updateData", verifyToken, (req, res) => {
  const userIndex = data.findIndex((user) => user.name === req.userName);
  if (userIndex !== -1) {
    data[userIndex].designation = req.body.designation;
    res.send(data);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});


/**
 * @swagger
 * /interview/deleteData:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user from the list.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
 *         description: JWT token in the "Authorization" header.
 *     responses:
 *       200:
 *         description: User removed successfully.
 *       404:
 *         description: User not found.
 *     security:
 *       - JWT: []  # This associates the '/interview/deleteData' endpoint with the 'JWT' security definition.
 */
router.delete("/deleteData", verifyToken, (req, res) => {
  const userIndex = data.findIndex((user) => user.name === req.userName);
  if (userIndex !== -1) {
    const temp = data[data.length - 1];
    data[userIndex] = temp;
    data.pop();
    res.send({ message: "User removed successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;
