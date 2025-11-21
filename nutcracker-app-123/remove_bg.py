from PIL import Image
import os

def remove_background(image_path):
    try:
        img = Image.open(image_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        # Get the color of the top-left pixel to assume as background
        bg_color = datas[0]
        
        # Tolerance for background color matching
        tolerance = 10

        for item in datas:
            # Check if pixel is close to background color
            if (abs(item[0] - bg_color[0]) < tolerance and
                abs(item[1] - bg_color[1]) < tolerance and
                abs(item[2] - bg_color[2]) < tolerance):
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(image_path, "PNG")
        print(f"Processed {image_path}")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

assets_dir = "/home/dustin/dev/nutcracker/nutcracker-app-123/src/assets"
remove_background(os.path.join(assets_dir, "nutcracker_idle.png"))
remove_background(os.path.join(assets_dir, "nutcracker_cracking.png"))
