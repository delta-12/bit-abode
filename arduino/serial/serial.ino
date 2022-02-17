size_t bytesNum;
byte serialBuf[5];
long serialData[20];

void setup() {
  Serial.begin(9600);
  for (int i = 0; i <= 13; i++) {
    pinMode(i, OUTPUT);
  }
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
    setDigital(buf);
    break;
  case 0x01:
    setAnalog(buf);
    break;
  default:
    break;
  }
}

void setDigital(byte *buf)
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

void setAnalog(byte *buf)
{
  int port = buf[1];
  int cmd = buf[2];
  
  analogWrite(port, cmd);
}
