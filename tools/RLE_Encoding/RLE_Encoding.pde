PImage img1;
PImage img2;
float r,t,w; 

void setup() {

  img1 = loadImage("musik.png");
  size(img1.width, img1.height);
  img1.loadPixels();
  float z = 0;
  String s =Integer.toString(img1.width);
  s += ",";  int n = 0;
  int c = 0;
  int b = 0;
  for (int loc = 0; loc < img1.width*img1.height; loc++) {
    z = brightness(img1.pixels[loc]);
    println(z);
    if (z < 170) {
      b = 0;
    }else{
      b = 1;
    }
    if (b == c){
      n += 1;
    } else {
      s += Integer.toString(n);
      s += ",";
      n = 1;
      c = b;
    }
  }
  println(s);

  

} 
void draw() {

}

