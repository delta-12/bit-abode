size_t bytesNum;
byte serialBuf[5];
long serialData[20];

void setup(void)
{
  Serial.begin(9600);
  pinMode(5, OUTPUT );
  pinMode(3, OUTPUT);
}

void loop(void)
{
  if (Serial.available() > 0)
  {
    bytesNum = Serial.readBytes(serialBuf, 5);
    parseBytes(serialBuf);
  }
  delay(50);
}

void parseBytes(byte *buf)
{
  switch (buf[0])
  {
  case 0x00:
    lights(buf);
    break;
  case 0x01:
    alarm(buf);
    break;
  default:
    break;
  }
}

void lights(byte *buf)
{
  int port = buf[1];
  int cmd = buf[2];
  
  if (cmd == 1)
  {
    digitalWrite(port, HIGH);
  }
  if (cmd == 0)
  {
    digitalWrite(port, LOW);
  }
}

void alarm(byte *buf)
{
  int port = buf[1];
  int cmd = buf[2];
  
  if (cmd == 1)
  {
    digitalWrite(port, HIGH);
  }
  if (cmd == 0)
  {
    digitalWrite(port, LOW);
  }
}
