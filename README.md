Evaluating Audio Source Separation Models Through Objective Metrics and Perceptual Evaluation

This project investigated the relationship between objective measures and perceptual evaluation of audio source separation models. 
Specifically, it aimed to determine whether or not the widely used Signal-to-Distortion Ratio (SDR), Signal-to-Interference Ratio (SIR), 
Source to Spatial Dis- tortion Image (ISR), and Signal-to-Artifacts Ratio (SAR) metrics accurately reflect the perceived quality of 
separated sources by human listeners

To install the web application, follow the below instructions:

1) Install Backend Dependencies:
pip install -r requirements.txt
2) Install Frontend Dependencies:
npm install
3) Initialize your database by running the migration scripts provided
python manage.py migrate
4) Download sample tracks, store in folder named 'musdb'
https://leeds365-my.sharepoint.com/:f:/r/personal/ed19mk3_leeds_ac_uk/Documents/Personal%20Project/Evaluating%20Audio%20Source%20Separation%20Models%20Through%20Objective%20Metrics%20and%20Perceptual%20Quality/musdb18?csf=1&web=1&e=sg6H1J
5) Create directories:
spleeter/
demucs/htdemucs/

The directory layout should follow:
Project
|
|- api/
|
|- assm-compare/
|
|- demucs
|  |- htdemucs/
|
|- spleeter/
|
|- musdb18/
|
|- uploads/
