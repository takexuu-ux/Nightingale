import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 2560, 1440

def make_ecg_wave(y_base, start_x, end_x, amp=45):
    points = []
    x = start_x
    while x < end_x:
        # Baseline
        for dx in range(0, 120, 4):
            points.append((x + dx, y_base + math.sin(dx * 0.05) * 1.5))
        x += 120
        if x >= end_x: break
        
        # P-wave
        for dx in range(0, 45, 3):
            rad = (dx / 45.0) * math.pi
            points.append((x + dx, y_base - math.sin(rad) * (amp * 0.28)))
        x += 45
        if x >= end_x: break
        
        # PR segment
        for dx in range(0, 30, 4):
            points.append((x + dx, y_base))
        x += 30
        if x >= end_x: break
        
        # Q-dip
        points.append((x + 6, y_base + amp * 0.18))
        x += 6
        if x >= end_x: break
        
        # R-peak
        points.append((x + 8, y_base - amp * 1.25))
        x += 8
        if x >= end_x: break
        
        # S-dip
        points.append((x + 10, y_base + amp * 0.35))
        x += 10
        if x >= end_x: break
        
        # ST segment
        for dx in range(0, 30, 4):
            points.append((x + dx, y_base))
        x += 30
        if x >= end_x: break
        
        # T-wave
        for dx in range(0, 65, 3):
            rad = (dx / 65.0) * math.pi
            points.append((x + dx, y_base - math.sin(rad) * (amp * 0.48)))
        x += 65
        if x >= end_x: break
        
        # Baseline
        for dx in range(0, 70, 4):
            points.append((x + dx, y_base))
        x += 70
        
    return points

def draw_dna_helix(draw, glow_draw, cx, start_y, end_y, width=70, period=220, opacity_mult=1.0):
    """Draws an authentic, elegant glowing DNA double-helix spiral with base-pair rungs."""
    y = start_y
    step = 4
    pts_left = []
    pts_right = []
    rungs = []
    
    while y <= end_y:
        angle = (y / float(period)) * math.pi * 2.0
        sin_val = math.sin(angle)
        cos_val = math.cos(angle)
        
        xl = cx + sin_val * width
        xr = cx - sin_val * width
        
        depth_l = (cos_val + 1.0) * 0.5
        depth_r = ((-cos_val) + 1.0) * 0.5
        
        pts_left.append((xl, y, depth_l))
        pts_right.append((xr, y, depth_r))
        
        # Add base pair rungs periodically
        if int(y) % 36 < step:
            rungs.append((xl, y, xr, y, (depth_l + depth_r) * 0.5))
            
        y += step
        
    # Draw rungs
    for x1, y1, x2, y2, depth in rungs:
        a = int((depth * 0.25 + 0.15) * 255 * opacity_mult)
        if a > 5:
            glow_draw.line([(x1, y1), (x2, y2)], fill=(168, 85, 247, int(a * 0.6)), width=4)
            draw.line([(x1, y1), (x2, y2)], fill=(220, 195, 255, a), width=2)
            
    # Draw strands
    for i in range(len(pts_left) - 1):
        x1, y1, d1 = pts_left[i]
        x2, y2, d2 = pts_left[i+1]
        a = int((d1 * 0.4 + 0.2) * 255 * opacity_mult)
        if a > 5:
            glow_draw.line([(x1, y1), (x2, y2)], fill=(168, 85, 247, int(a * 0.7)), width=5)
            draw.line([(x1, y1), (x2, y2)], fill=(235, 215, 255, a), width=2)
            
    for i in range(len(pts_right) - 1):
        x1, y1, d1 = pts_right[i]
        x2, y2, d2 = pts_right[i+1]
        a = int((d1 * 0.4 + 0.2) * 255 * opacity_mult)
        if a > 5:
            glow_draw.line([(x1, y1), (x2, y2)], fill=(139, 92, 246, int(a * 0.7)), width=5)
            draw.line([(x1, y1), (x2, y2)], fill=(215, 195, 255, a), width=2)

def generate_dark():
    print("Synthesizing rich, atmospheric dark medical landscape...")
    arr = np.zeros((H, W, 3), dtype=np.float32)
    y_coords, x_coords = np.mgrid[0:H, 0:W]
    
    # 1. Base Multi-Stop Twilight Gradient (Deep Navy/Obsidian #0B0818 -> Royal Amethyst #1E1238 -> Deep Indigo #140C28)
    norm_y = y_coords / float(H)
    norm_x = x_coords / float(W)
    
    # Rich deep palette
    top_c = np.array([14.0, 9.0, 26.0])       # #0E091A
    mid_c = np.array([28.0, 16.0, 54.0])      # #1C1036
    bot_c = np.array([10.0, 7.0, 20.0])       # #0A0714
    
    # Vertical blend
    for c in range(3):
        upper_blend = top_c[c] * (1.0 - norm_y * 1.8) + mid_c[c] * (norm_y * 1.8)
        lower_blend = mid_c[c] * (1.0 - (norm_y - 0.55) * 2.2) + bot_c[c] * ((norm_y - 0.55) * 2.2)
        arr[:, :, c] = np.where(norm_y < 0.55, upper_blend, lower_blend)
        
    # 2. Layered Ethereal Silhouettes (Gentle, soft-focus rolling ridges that fade into mist)
    # Ridge 1: Distant soft ridge (y ~ 750)
    wave1 = np.sin(x_coords * 0.0018) * 60 + np.sin(x_coords * 0.0042) * 35 + 750
    mask1 = 1.0 / (1.0 + np.exp(-(y_coords - wave1) * 0.04))
    arr[:, :, 0] += mask1 * 14.0
    arr[:, :, 1] += mask1 * 8.0
    arr[:, :, 2] += mask1 * 26.0
    
    # Ridge 2: Mid-ground misty ridge (y ~ 980)
    wave2 = np.cos(x_coords * 0.0022 + 1.2) * 75 + np.sin(x_coords * 0.0055) * 25 + 980
    mask2 = 1.0 / (1.0 + np.exp(-(y_coords - wave2) * 0.035))
    arr[:, :, 0] = arr[:, :, 0] * (1.0 - mask2 * 0.45) + (mask2 * 12.0)
    arr[:, :, 1] = arr[:, :, 1] * (1.0 - mask2 * 0.45) + (mask2 * 7.0)
    arr[:, :, 2] = arr[:, :, 2] * (1.0 - mask2 * 0.45) + (mask2 * 22.0)
    
    # 3. Luminous Royal Lavender Nebula Aura behind the Botanical Lungs (center 1880, 640)
    dist_lung = ((x_coords - 1880) ** 2) / (720.0 ** 2) + ((y_coords - 640) ** 2) / (560.0 ** 2)
    nebula = np.exp(-dist_lung * 1.6)
    arr[:, :, 0] += nebula * 42.0
    arr[:, :, 1] += nebula * 24.0
    arr[:, :, 2] += nebula * 78.0
    
    # Secondary ambient glow on left top for balanced lighting
    dist_left = ((x_coords - 450) ** 2) / (650.0 ** 2) + ((y_coords - 250) ** 2) / (450.0 ** 2)
    left_aura = np.exp(-dist_left * 2.2)
    arr[:, :, 0] += left_aura * 15.0
    arr[:, :, 1] += left_aura * 10.0
    arr[:, :, 2] += left_aura * 30.0
    
    # Micro-dither
    noise = (np.random.rand(H, W, 3) - 0.5) * 1.2
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    
    base_img = Image.fromarray(arr, mode='RGB')
    
    # Overlays: Vector line art & medical elements
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    glow_overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    glow_draw = ImageDraw.Draw(glow_overlay)
    
    # 1. Glowing Medical Cross & Telemetry Star Nodes
    stars = [
        (1350, 280, 0.28), (1520, 190, 0.35), (2250, 220, 0.32),
        (2380, 480, 0.25), (1280, 520, 0.22), (1650, 880, 0.38),
        (2150, 920, 0.30), (1420, 1120, 0.24), (2320, 1180, 0.30),
        (750, 210, 0.18), (920, 380, 0.15), (620, 820, 0.16)
    ]
    for sx, sy, op in stars:
        a = int(op * 255)
        # 4-point medical sparkle star
        sz = 8
        glow_draw.ellipse([sx - sz, sy - sz, sx + sz, sy + sz], fill=(168, 85, 247, int(a * 0.7)))
        draw.line([(sx - sz - 4, sy), (sx + sz + 4, sy)], fill=(240, 225, 255, a), width=1)
        draw.line([(sx, sy - sz - 4), (sx, sy + sz + 4)], fill=(240, 225, 255, a), width=1)
        draw.ellipse([sx - 2, sy - 2, sx + 2, sy + 2], fill=(255, 255, 255, a))
        
    # 2. Glowing DNA Double-Helix (delicately floating in the upper right atmospheric mist)
    draw_dna_helix(draw, glow_draw, cx=1550, start_y=120, end_y=1340, width=55, period=260, opacity_mult=0.75)
    
    # 3. Luminous ECG Heartbeat Telemetry Waveform across bottom (y=1080)
    ecg_y = 1080
    ecg_pts = make_ecg_wave(ecg_y, 80, W + 120, amp=50)
    for i in range(len(ecg_pts) - 1):
        p1, p2 = ecg_pts[i], ecg_pts[i+1]
        mid_x = (p1[0] + p2[0]) * 0.5
        
        # Smooth envelope across the screen
        if mid_x < 150:
            env = 0.05
        elif mid_x < 1650:
            env = 0.08 + ((mid_x - 150) / 1500.0) * 0.42  # rises up to ~0.50
        else:
            env = 0.50 - ((mid_x - 1650) / 900.0) * 0.35  # stays visible
            
        a_glow = int(env * 85)
        a_core = int(env * 180)
        
        glow_draw.line([p1, p2], fill=(168, 85, 247, a_glow), width=6)
        draw.line([p1, p2], fill=(230, 210, 255, a_core), width=2)
        
    # 4. Secondary faint cardiac lead trace (faded parallel rhythm line at y=1140)
    lead2_pts = make_ecg_wave(1150, 220, W + 100, amp=24)
    for i in range(len(lead2_pts) - 1):
        p1, p2 = lead2_pts[i], lead2_pts[i+1]
        mid_x = (p1[0] + p2[0]) * 0.5
        env = max(0.02, min(0.24, (mid_x / float(W)) * 0.28))
        a_glow = int(env * 45)
        a_core = int(env * 95)
        glow_draw.line([p1, p2], fill=(124, 58, 237, a_glow), width=4)
        draw.line([p1, p2], fill=(200, 180, 245, a_core), width=1)
        
    # Blur glow layer
    glow_blurred = glow_overlay.filter(ImageFilter.GaussianBlur(radius=8))
    
    img = Image.alpha_composite(base_img.convert('RGBA'), glow_blurred)
    img = Image.alpha_composite(img, overlay)
    
    final_rgb = img.convert('RGB')
    final_rgb.save('Nightingale/src/apk/bg-web-landscape-dark.jpg', 'JPEG', quality=95)
    print("Rich dark medical wallpaper generated successfully.")

def generate_light():
    print("Synthesizing rich, atmospheric light medical landscape...")
    arr = np.zeros((H, W, 3), dtype=np.float32)
    y_coords, x_coords = np.mgrid[0:H, 0:W]
    
    norm_y = y_coords / float(H)
    norm_x = x_coords / float(W)
    
    # Crisp, elegant Nordic medical palette: #FAF8FE -> #EDE6FA -> #E3DAF6
    top_c = np.array([251.0, 249.0, 254.0])
    mid_c = np.array([238.0, 230.0, 250.0])
    bot_c = np.array([228.0, 218.0, 246.0])
    
    for c in range(3):
        upper_blend = top_c[c] * (1.0 - norm_y * 1.8) + mid_c[c] * (norm_y * 1.8)
        lower_blend = mid_c[c] * (1.0 - (norm_y - 0.55) * 2.2) + bot_c[c] * ((norm_y - 0.55) * 2.2)
        arr[:, :, c] = np.where(norm_y < 0.55, upper_blend, lower_blend)
        
    # Layered ridges in subtle pastel tones
    wave1 = np.sin(x_coords * 0.0018) * 60 + np.sin(x_coords * 0.0042) * 35 + 750
    mask1 = 1.0 / (1.0 + np.exp(-(y_coords - wave1) * 0.04))
    arr[:, :, 0] -= mask1 * 8.0
    arr[:, :, 1] -= mask1 * 12.0
    arr[:, :, 2] -= mask1 * 3.0
    
    wave2 = np.cos(x_coords * 0.0022 + 1.2) * 75 + np.sin(x_coords * 0.0055) * 25 + 980
    mask2 = 1.0 / (1.0 + np.exp(-(y_coords - wave2) * 0.035))
    arr[:, :, 0] -= mask2 * 10.0
    arr[:, :, 1] -= mask2 * 14.0
    arr[:, :, 2] -= mask2 * 4.0
    
    # Soft lavender radiance on right
    dist_lung = ((x_coords - 1880) ** 2) / (720.0 ** 2) + ((y_coords - 640) ** 2) / (560.0 ** 2)
    nebula = np.exp(-dist_lung * 1.6)
    arr[:, :, 0] -= nebula * 18.0
    arr[:, :, 1] -= nebula * 24.0
    arr[:, :, 2] -= nebula * 6.0
    
    noise = (np.random.rand(H, W, 3) - 0.5) * 0.9
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    base_img = Image.fromarray(arr, mode='RGB')
    
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    glow_overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    glow_draw = ImageDraw.Draw(glow_overlay)
    
    # DNA Helix in soft violet
    draw_dna_helix(draw, glow_draw, cx=1550, start_y=120, end_y=1340, width=55, period=260, opacity_mult=0.55)
    
    # ECG line in soft violet
    ecg_y = 1080
    ecg_pts = make_ecg_wave(ecg_y, 80, W + 120, amp=46)
    for i in range(len(ecg_pts) - 1):
        p1, p2 = ecg_pts[i], ecg_pts[i+1]
        mid_x = (p1[0] + p2[0]) * 0.5
        env = max(0.08, min(0.42, 0.08 + (mid_x / float(W)) * 0.36))
        a_glow = int(env * 65)
        a_core = int(env * 150)
        glow_draw.line([p1, p2], fill=(124, 58, 237, a_glow), width=5)
        draw.line([p1, p2], fill=(108, 79, 214, a_core), width=2)
        
    glow_blurred = glow_overlay.filter(ImageFilter.GaussianBlur(radius=7))
    img = Image.alpha_composite(base_img.convert('RGBA'), glow_blurred)
    img = Image.alpha_composite(img, overlay)
    
    final_rgb = img.convert('RGB')
    final_rgb.save('Nightingale/src/apk/bg-web-landscape-light.jpg', 'JPEG', quality=95)
    print("Rich light medical wallpaper generated successfully.")

if __name__ == '__main__':
    generate_dark()
    generate_light()
