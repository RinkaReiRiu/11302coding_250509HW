let video;
let poseNet;
let poses = [];
let skeletons = [];

function setup() {
  createCanvas(windowWidth, windowHeight); // Create full-sized canvas

  // Create full-sized video capture element
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();

  // Load PoseNet model
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', getPoses);
}

function getPoses(results) { // Callback function for pose detection
  if (results.length > 0) {
    poses = results[0].pose.keypoints;
    skeletons = results[0].skeleton;
  }
}

function modelLoaded() { // Callback function when the model is loaded
  console.log('PoseNet model loaded');
}

function draw() {
  background(0);

  // Draw mirrored video
  drawCamera();

  // Mirror the coordinate system
  push();
  translate(width, 0);
  scale(-1, 1); // Flip horizontally

  // Draw the keypoints and skeletons
  if (poses.length > 0) {
    let rightWrist = poses.find(p => p.part === "rightWrist");
    let leftWrist = poses.find(p => p.part === "leftWrist");

    let eyeR = poses.find(p => p.part === "rightEye");
    let eyeL = poses.find(p => p.part === "leftEye");

    if (eyeR && eyeL) {
      let distance = dist(eyeR.position.x, eyeR.position.y, eyeL.position.x, eyeL.position.y);
      fill(255, 0, 0);
      ellipse(eyeR.position.x, eyeR.position.y, distance);
      ellipse(eyeL.position.x, eyeL.position.y, distance);
    }

    if (rightWrist && leftWrist) {
      fill(0, 255, 0);
      ellipse(rightWrist.position.x, rightWrist.position.y, 20);
      ellipse(leftWrist.position.x, leftWrist.position.y, 20);
    }

    drawKeypoints(poses);
    drawSkeleton(skeletons);
  }

  pop(); // Restore normal drawing mode
}

function drawKeypoints(poses) { // Draw keypoints
  if (!poses) return;
  for (let i = 0; i < poses.length; i++) {
    let keypoint = poses[i];
    fill(255, 0, 0);
    ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
  }
}

function drawSkeleton(skeletons) { // Draw skeletons
  if (!skeletons) return;
  for (let i = 0; i < skeletons.length; i++) {
    let partA = skeletons[i][0];
    let partB = skeletons[i][1];
    stroke(255, 0, 0);
    line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
  }
}

function drawCamera() { // Draw the mirrored camera
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);
  pop();
}

function windowResized() { // Handle window resizing
  resizeCanvas(windowWidth, windowHeight);
}

/*
let video;
let poseNet;
let poses = [];
let skeletons = [];

function setup() {
  createCanvas(windowWidth, windowHeight); // Create full-sized canvas

  // Create full-sized video capture element
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();

  // Load PoseNet model
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', getPoses);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(64);
}

function getPoses(results) { // Callback function for pose detection
  if (results.length > 0) {
    poses = results[0].pose.keypoints;
    skeletons = results[0].skeleton;
  }
}

function modelLoaded() { // Callback function when the model is loaded
  console.log('PoseNet model loaded');
}

function draw() {
  background(0);
  // Draw mirrored video
  drawCamera();

  // Mirror the coordinate system
  push();
  translate(width, 0);
  scale(-1, 1); // Flip horizontally

  // Draw the keypoints and skeletons
  if (poses.length > 0) {
    let rightWrist = poses.find(p => p.part === "rightWrist");
    let leftWrist = poses.find(p => p.part === "leftWrist");
    let eyeR = poses.find(p => p.part === "rightEye");
    let eyeL = poses.find(p => p.part === "leftEye");
    let leftShoulder = poses.find(p => p.part === "leftShoulder");
    let rightShoulder = poses.find(p => p.part === "rightShoulder");

    if (leftShoulder && rightShoulder) {
      fill('#170033'); // Dark color for the body
      beginShape();
      vertex((eyeR.position.x + eyeL.position.x) / 2, (eyeR.position.y + eyeL.position.y) / 2);
      vertex(leftShoulder.position.x, leftShoulder.position.y);
      vertex(leftShoulder.position.x, height);
      vertex(rightShoulder.position.x, height);
      vertex(rightShoulder.position.x, rightShoulder.position.y);
      vertex((eyeR.position.x + eyeL.position.x) / 2, (eyeR.position.y + eyeL.position.y) / 2);
      endShape(CLOSE);
    }

    if (eyeR && eyeL) {
      let distance = dist(eyeR.position.x, eyeR.position.y, eyeL.position.x, eyeL.position.y);
      fill(255, 224, 189); // skin color for face
      ellipse((eyeR.position.x + eyeL.position.x) / 2, (eyeR.position.y + eyeL.position.y) / 2, distance*3, distance*4);
      fill(255); // White color for eyes
      ellipse(eyeR.position.x, eyeR.position.y, distance*0.7, distance*0.4);
      ellipse(eyeL.position.x, eyeL.position.y, distance*0.7, distance*0.4);
      fill(0); // Black color for pupils
      ellipse(eyeR.position.x, eyeR.position.y, distance*0.3);
      ellipse(eyeL.position.x, eyeL.position.y, distance*0.3);
    }

    if (rightWrist && leftWrist) {
      fill(0, 255, 0);
      ellipse(rightWrist.position.x, rightWrist.position.y, 20);
      ellipse(leftWrist.position.x, leftWrist.position.y, 20);
    }

    drawKeypoints(poses);
    drawSkeleton(skeletons);
  }

  pop(); // Restore normal drawing mode

  // Show loading if video is not ready
  if (!video.loadedmetadata) {
    fill(255);
    text('Loading...', width / 2, height / 2);
  }
}

function drawKeypoints(poses) { // Draw keypoints
  if (!poses) return;
  for (let i = 0; i < poses.length; i++) {
    let keypoint = poses[i];
    fill(255, 0, 0);
    ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
  }
}

function drawSkeleton(skeletons) { // Draw skeletons
  if (!skeletons) return;
  for (let i = 0; i < skeletons.length; i++) {
    let partA = skeletons[i][0];
    let partB = skeletons[i][1];
    stroke(255, 0, 0);
    line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
  }
}

function drawCamera() { // Draw the mirrored camera
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);
  pop();
}

function windowResized() { // Handle window resizing
  resizeCanvas(windowWidth, windowHeight);
}

*/