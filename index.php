<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Test HTML5 Game</title>
	<link rel="stylesheet" href="game.css">
</head>
<body>
	<div class="stage">
		<canvas id="canvasBg" width="720px" height="450px"></canvas>
		<canvas id="canvasClouds" width="720px" height="450px"></canvas>
		<canvas id="canvasJet" width="720px" height="450px"></canvas>
		<canvas id="canvasEnemy" width="720px" height="450px"></canvas>
		<canvas id="canvasHud" width="720px" height="450px"></canvas>
		<script src="game.js"></script>
		<div id="pausedOverlay">PAUSED</div>
		<div id="pausedWin">YOU WIN!!</div>
	</div>
</body>
</html>