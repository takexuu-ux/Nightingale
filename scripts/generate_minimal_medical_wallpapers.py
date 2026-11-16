import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 2560, 1440

def make_ecg_points(y_base, start_x, end_x, amplitude=55):
    """Generates realistic ECG telemetry coordinates (P, Q, R, S, T complex)."""
    points = []
    x = start_x
    cycle_w = 420
    
    while x < end_x:
        # 1. Baseline
        for dx in range(0, 140, 4):
            points.append((x + dx, y_base + math.sin(dx * 0.04) * 1.5))
        x += 140
        if x >= end_x: break
        
        # 2. P-wave (gentle rounded rise)
        for dx in range(0, 50, 3):
            rad = (dx / 50.0) * math.pi
            points.append((x + dx, y_base - math.sin(rad) * (amplitude * 0.22)))
        x += 50
        if x >= end_x: break
        
        # 3. PR segment (flat)
        for dx in range(0, 35, 4):
            points.append((x + dx, y_base))
        x += 35
        if x >= end_x: break
        
        # 4. Q-dip
        points.append((x + 8, y_base + amplitude * 0.18))
        x += 8
        if x >= end_x: break
        
        # 5. R-spike (sharp peak)
        points.append((x + 10, y_base - amplitude * 1.15))
        x += 10
        if x >= end_x: break
        
        # 6. S-dip (sharp valley)
        points.append((x + 12, y_base + amplitude * 0.32))
        x += 12
        if x >= end_x: break
        
        # 7. ST segment (flat)
        for dx in range(0, 35, 4):
            points.append((x + dx, y_base))
        x += 35
        if x >= end_x: break
        
        # 8. T-wave (smooth medium rise)
        for dx in range(0, 75, 4):
            rad = (dx / 75.0) * math.pi
            points.append((x + dx, y_base - math.sin(rad) * (amplitude * 0.42)))
        x += 75
        if x >= end_x: break
        
        # 9. TP baseline
        for dx in range(0, 65, 4):
            points.append((x + dx, y_base))
        x += 65

    return points

def render_capillary_tree(draw, x0, y0, length, angle, depth, max_depth, color_fn):
    """Draws a delicate, fading botanical capillary / bronchial branch network."""
    if depth > max_depth or length < 8:
        return
    x1 = x0 + math.cos(angle) * length
    y1 = y0 + math.sin(angle) * length
    
    color = color_fn(depth, max_depth, x0, y0)
    if color and color[3] > 0:
        draw.line([(x0, y0), (x1, y1)], fill=color, width=max(1, int(2.2 - depth * 0.35)))
    
    # Subdivide
    branch_count = 2 if depth < 3 else (2 if (depth % 2 == 0) else 1)
    spread = 0.38 - depth * 0.03
    length_mult = 0.72 + (0.1 * math.sin(depth))
    
    render_capillary_tree(draw, x1, y1, length * length_mult, angle - spread, depth + 1, max_depth, color_fn)
    render_capillary_tree(draw, x1, y1, length * length_mult, angle + spread, depth + 1, max_depth, color_fn)

def create_dark_wallpaper():
    print("Generating minimal fading dark medical wallpaper...")
    # Base canvas gradient
    arr = np.zeros((H, W, 3), dtype=np.float32)
    
    # Coordinates
    y_coords, x_coords = np.mgrid[0:H, 0:W]
    
    # Deep midnight canvas base: #090614 to #0E0A1E
    grad_y = y_coords / float(H)
    base_r = 9.0 + grad_y * 5.0
    base_g = 6.0 + grad_y * 4.0
    base_b = 18.0 + grad_y * 12.0
    
    arr[:, :, 0] = base_r
    arr[:, :, 1] = base_g
    arr[:, :, 2] = base_b
    
    # Ethereal radial glow on right-center behind the botanical lungs: center (1850, 620)
    dist_sq = ((x_coords - 1850) ** 2) / (750.0 ** 2) + ((y_coords - 620) ** 2) / (550.0 ** 2)
    glow_mask = np.exp(-dist_sq * 1.8)
    
    # Glow tint: soft royal purple & lavender
    arr[:, :, 0] += glow_mask * 28.0
    arr[:, :, 1] += glow_mask * 18.0
    arr[:, :, 2] += glow_mask * 52.0
    
    # Subtle secondary aura at bottom right: center (2100, 1150)
    dist2 = ((x_coords - 2100) ** 2) / (600.0 ** 2) + ((y_coords - 1150) ** 2) / (450.0 ** 2)
    glow2 = np.exp(-dist2 * 2.2)
    arr[:, :, 0] += glow2 * 18.0
    arr[:, :, 1] += glow2 * 10.0
    arr[:, :, 2] += glow2 * 34.0
    
    # Micro-dither to prevent color banding
    noise = (np.random.rand(H, W, 3) - 0.5) * 1.2
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    
    img = Image.fromarray(arr, mode='RGB')
    
    # Now draw subtle fading medical vector elements
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # 1. Telemetry grid coordinate crosses (very faint, opacity ~6%)
    for gx in range(200, W, 220):
        for gy in range(160, H, 200):
            # Fade out towards the left / center
            fade = min(1.0, max(0.0, (gx - 500) / 1400.0)) * 0.08
            alpha = int(fade * 255)
            if alpha > 4:
                draw.line([(gx - 4, gy), (gx + 4, gy)], fill=(160, 130, 240, alpha), width=1)
                draw.line([(gx, gy - 4), (gx, gy + 4)], fill=(160, 130, 240, alpha), width=1)
    
    # 2. Fading Botanical Capillary / Bronchial Trees (on right behind lungs)
    def dark_capillary_color(d, max_d, x, y):
        # Fade based on distance from right center
        dist_factor = max(0.0, min(1.0, 1.0 - math.hypot(x - 1880, y - 620) / 700.0))
        depth_factor = (1.0 - (d / float(max_d))) * 0.8 + 0.2
        a = int(dist_factor * depth_factor * 34) # delicate ~13% max alpha
        return (180, 150, 255, a)
    
    render_capillary_tree(draw, 1880, 780, 160, -math.pi * 0.52, 1, 7, dark_capillary_color)
    render_capillary_tree(draw, 1740, 820, 130, -math.pi * 0.65, 1, 6, dark_capillary_color)
    render_capillary_tree(draw, 2020, 800, 140, -math.pi * 0.38, 1, 6, dark_capillary_color)
    
    # 3. Fading ECG Heartbeat Telemetry Line across lower-third
    ecg_y = int(H * 0.72)
    ecg_points = make_ecg_points(ecg_y, 100, W + 100, amplitude=48)
    
    glow_overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_overlay)
    
    # Draw segments with horizontal alpha gradient (fading in from x=400, peak at x=1750, fade out by x=2450)
    for i in range(len(ecg_points) - 1):
        p1 = ecg_points[i]
        p2 = ecg_points[i + 1]
        mid_x = (p1[0] + p2[0]) * 0.5
        
        # Alpha envelope: 0 at x=200, rises smoothly to ~0.26 at x=1750, fades to 0 by x=2400
        if mid_x < 200:
            env = 0.0
        elif mid_x < 1750:
            env = ((mid_x - 200) / 1550.0) ** 1.3
        else:
            env = max(0.0, 1.0 - ((mid_x - 1750) / 650.0))
        
        alpha_core = int(env * 68)  # max ~27%
        alpha_glow = int(env * 42)  # max ~16%
        
        if alpha_core > 3:
            glow_draw.line([p1, p2], fill=(168, 85, 247, alpha_glow), width=5)
            draw.line([p1, p2], fill=(225, 205, 255, alpha_core), width=2)
    
    # Blur the glow layer for authentic soft neon dispersion
    glow_blurred = glow_overlay.filter(ImageFilter.GaussianBlur(radius=8))
    
    # Composite all layers onto base
    img = Image.alpha_composite(img.convert('RGBA'), glow_blurred)
    img = Image.alpha_composite(img, overlay)
    
    final_rgb = img.convert('RGB')
    final_rgb.save('Nightingale/src/apk/bg-web-landscape-dark.jpg', 'JPEG', quality=95)
    print("Dark wallpaper saved successfully.")

def create_light_wallpaper():
    print("Generating minimal fading light medical wallpaper...")
    arr = np.zeros((H, W, 3), dtype=np.float32)
    y_coords, x_coords = np.mgrid[0:H, 0:W]
    
    # Clean, airy alabaster mist: #F9F8FC to #ECE7F8
    grad_y = y_coords / float(H)
    base_r = 249.0 - grad_y * 12.0
    base_g = 248.0 - grad_y * 16.0
    base_b = 252.0 - grad_y * 6.0
    
    arr[:, :, 0] = base_r
    arr[:, :, 1] = base_g
    arr[:, :, 2] = base_b
    
    # Soft morning lavender aura on right: center (1850, 620)
    dist_sq = ((x_coords - 1850) ** 2) / (800.0 ** 2) + ((y_coords - 620) ** 2) / (600.0 ** 2)
    glow_mask = np.exp(-dist_sq * 1.9)
    
    # Tint softly: subtle periwinkle-lavender diffusion
    arr[:, :, 0] -= glow_mask * 14.0
    arr[:, :, 1] -= glow_mask * 18.0
    arr[:, :, 2] -= glow_mask * 4.0
    
    noise = (np.random.rand(H, W, 3) - 0.5) * 0.9
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    
    img = Image.fromarray(arr, mode='RGB')
    
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # 1. Telemetry grid coordinate crosses (faint lilac, ~5% opacity)
    for gx in range(200, W, 220):
        for gy in range(160, H, 200):
            fade = min(1.0, max(0.0, (gx - 500) / 1400.0)) * 0.06
            alpha = int(fade * 255)
            if alpha > 3:
                draw.line([(gx - 4, gy), (gx + 4, gy)], fill=(120, 90, 190, alpha), width=1)
                draw.line([(gx, gy - 4), (gx, gy + 4)], fill=(120, 90, 190, alpha), width=1)
    
    # 2. Light Botanical Capillaries
    def light_capillary_color(d, max_d, x, y):
        dist_factor = max(0.0, min(1.0, 1.0 - math.hypot(x - 1880, y - 620) / 720.0))
        depth_factor = (1.0 - (d / float(max_d))) * 0.8 + 0.2
        a = int(dist_factor * depth_factor * 26) # subtle ~10% max alpha
        return (108, 79, 214, a)
    
    render_capillary_tree(draw, 1880, 780, 150, -math.pi * 0.52, 1, 7, light_capillary_color)
    render_capillary_tree(draw, 1740, 820, 120, -math.pi * 0.65, 1, 6, light_capillary_color)
    render_capillary_tree(draw, 2020, 800, 130, -math.pi * 0.38, 1, 6, light_capillary_color)
    
    # 3. Fading ECG Heartbeat Telemetry Line
    ecg_y = int(H * 0.72)
    ecg_points = make_ecg_points(ecg_y, 100, W + 100, amplitude=45)
    
    glow_overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_overlay)
    
    for i in range(len(ecg_points) - 1):
        p1 = ecg_points[i]
        p2 = ecg_points[i + 1]
        mid_x = (p1[0] + p2[0]) * 0.5
        
        if mid_x < 200:
            env = 0.0
        elif mid_x < 1750:
            env = ((mid_x - 200) / 1550.0) ** 1.3
        else:
            env = max(0.0, 1.0 - ((mid_x - 1750) / 650.0))
        
        alpha_core = int(env * 52)
        alpha_glow = int(env * 32)
        
        if alpha_core > 3:
            glow_draw.line([p1, p2], fill=(124, 58, 237, alpha_glow), width=5)
            draw.line([p1, p2], fill=(108, 79, 214, alpha_core), width=2)
            
    glow_blurred = glow_overlay.filter(ImageFilter.GaussianBlur(radius=7))
    img = Image.alpha_composite(img.convert('RGBA'), glow_blurred)
    img = Image.alpha_composite(img, overlay)
    
    final_rgb = img.convert('RGB')
    final_rgb.save('Nightingale/src/apk/bg-web-landscape-light.jpg', 'JPEG', quality=95)
    print("Light wallpaper saved successfully.")

if __name__ == '__main__':
    create_dark_wallpaper()
    create_light_wallpaper()
