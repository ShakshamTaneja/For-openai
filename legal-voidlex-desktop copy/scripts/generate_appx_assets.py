import os
from PIL import Image

def generate_appx_assets():
    logo_path = 'logo.png'
    output_dir = 'build/appx'
    os.makedirs(output_dir, exist_ok=True)
    
    # Load original gold-emblem logo
    logo = Image.open(logo_path)
    print(f"[AppX Builder] Loaded logo.png with size {logo.size} and mode {logo.mode}")
    
    # Target files to generate
    # Format: (filename, width, height, transparent_padding_factor)
    targets = [
        ("StoreLogo.png", 50, 50, 0.8),
        ("Square150x150Logo.png", 150, 150, 0.75),
        ("Square44x44Logo.png", 44, 44, 0.75),
        ("Wide310x150Logo.png", 310, 150, 0.65),
        ("Square310x310Logo.png", 310, 310, 0.75),
        ("Square71x71Logo.png", 71, 71, 0.75),
        ("SplashScreen.png", 620, 300, 0.55)
    ]
    
    for filename, width, height, padding_factor in targets:
        print(f"[AppX Builder] Generating {filename} ({width}x{height})...")
        
        # Create blank RGBA transparent canvas
        canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        
        # Calculate target logo dimensions centered inside the padding bounds
        target_w = int(width * padding_factor)
        logo_ratio = logo.size[0] / logo.size[1]
        target_h = int(target_w / logo_ratio)
        
        # If height exceeds maximum padded height bounds, scale based on height
        max_padded_h = int(height * padding_factor)
        if target_h > max_padded_h:
            target_h = max_padded_h
            target_w = int(target_h * logo_ratio)
            
        # Resize logo with high quality lanczos filters
        resized_logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Center coordinates
        offset_x = (width - target_w) // 2
        offset_y = (height - target_h) // 2
        
        # Composite onto canvas
        canvas.alpha_composite(resized_logo, (offset_x, offset_y))
        
        # Save output image as high-quality transparent PNG
        save_path = os.path.join(output_dir, filename)
        canvas.save(save_path, "PNG")
        print(f"[AppX Builder] Saved {filename} to {save_path}")

if __name__ == "__main__":
    generate_appx_assets()
