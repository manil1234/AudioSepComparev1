from museval.metrics import bss_eval
import soundfile as sf
import stempeg
import numpy as np

def compute_metrics(original_multitrack_file, separated_stems_folder):
    """
    Compute BSS metrics for separated stems.
    """
    # Load the multitrack file
    original_stems = {}
    for stem_id, stem_name in enumerate(['drums', 'bass', 'other', 'vocals'], start=1):
        stem, rate = stempeg.read_stems(original_multitrack_file, stem_id=stem_id)
        original_stems[stem_name] = stem

    # Load the separated stems
    separated_stems = {}
    for stem_name in ['drums', 'bass', 'other', 'vocals']:
        separated_stem, _ = sf.read(f'{separated_stems_folder}/{stem_name}.wav')
        separated_stems[stem_name] = separated_stem

    # Make sure all signals have the same length (truncate or pad if necessary)
    min_length = min(len(original_stems['drums']), len(separated_stems['drums']), 
                     len(original_stems['bass']), len(separated_stems['bass']), 
                     len(original_stems['other']), len(separated_stems['other']), 
                     len(original_stems['vocals']), len(separated_stems['vocals']))
    
    original_stems = {stem_name: original_stems[stem_name][:min_length] for stem_name in original_stems}
    separated_stems = {stem_name: separated_stems[stem_name][:min_length] for stem_name in separated_stems}

    # Compute BSS metrics for separated stems
    metrics = {}
    for stem_name in ['drums', 'bass', 'other', 'vocals']:
        sdr, isr, sir, sar, _ = bss_eval([original_stems[stem_name]], [separated_stems[stem_name]])
        metrics[stem_name] = {
            "Average SDR": calculate_average(sdr),
            "Average ISR": calculate_average(isr),
            "Average SAR": calculate_average(sar)
        }
    metrics["overall"] = {
        "Average SDR": (metrics["drums"]["Average SDR"] + metrics["bass"]["Average SDR"] + metrics["other"]["Average SDR"] + metrics["vocals"]["Average SDR"]) / 4,
        "Average ISR": (metrics["drums"]["Average ISR"] + metrics["bass"]["Average ISR"] + metrics["other"]["Average ISR"] + metrics["vocals"]["Average ISR"]) / 4,
        "Average SAR": (metrics["drums"]["Average SAR"] + metrics["bass"]["Average SAR"] + metrics["other"]["Average SAR"] + metrics["vocals"]["Average SAR"]) / 4
    }
    return metrics

# Calculate the averages for each metric
def calculate_average(metric_values):
    valid_values = metric_values.flatten()
    valid_values = valid_values[~np.isnan(valid_values)]
    valid_values = valid_values[(valid_values != np.inf)]
    if len(valid_values) > 0:
        return np.mean(valid_values)
    else:
        return np.nan


if __name__ == "__main__":
    multitrack_file = '../musdb18/Signe Jakobsen - What Have You Done To Me.stem.mp4'
    stems_folder = '../spleeter/Signe Jakobsen - What Have You Done To Me.stem'
    metrics = compute_metrics(multitrack_file, stems_folder)
    for stem_name, stem_metrics in metrics.items():
        print(f"Metrics for {stem_name.capitalize()} Stem:")
        for metric_name, value in stem_metrics.items():
            print(f"{metric_name}: {value}")
        print()
