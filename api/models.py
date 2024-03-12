from app import db

class Comparisons(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    song = db.Column(db.String(50), unique=True, nullable=False)
    
    # Demucs metrics
    demucs_bass_ISR = db.Column(db.Float)
    demucs_bass_SAR = db.Column(db.Float)
    demucs_bass_SDR = db.Column(db.Float)
    
    demucs_drums_ISR = db.Column(db.Float)
    demucs_drums_SAR = db.Column(db.Float)
    demucs_drums_SDR = db.Column(db.Float)
    
    demucs_other_ISR = db.Column(db.Float)
    demucs_other_SAR = db.Column(db.Float)
    demucs_other_SDR = db.Column(db.Float)
    
    demucs_vocals_ISR = db.Column(db.Float)
    demucs_vocals_SAR = db.Column(db.Float)
    demucs_vocals_SDR = db.Column(db.Float)

    demucs_overall_SDR = db.Column(db.Float)
    demucs_overall_time = db.Column(db.Float)
    
    # Spleeter metrics
    spleeter_bass_ISR = db.Column(db.Float)
    spleeter_bass_SAR = db.Column(db.Float)
    spleeter_bass_SDR = db.Column(db.Float)
    
    spleeter_drums_ISR = db.Column(db.Float)
    spleeter_drums_SAR = db.Column(db.Float)
    spleeter_drums_SDR = db.Column(db.Float)
    
    spleeter_other_ISR = db.Column(db.Float)
    spleeter_other_SAR = db.Column(db.Float)
    spleeter_other_SDR = db.Column(db.Float)
    
    spleeter_vocals_ISR = db.Column(db.Float)
    spleeter_vocals_SAR = db.Column(db.Float)
    spleeter_vocals_SDR = db.Column(db.Float)

    spleeter_overall_SDR = db.Column(db.Float)
    spleeter_overall_time = db.Column(db.Float)


