// pages/api/daily/end-room.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { roomName } = req.body;
  
      if (!roomName) {
        return res.status(400).json({ error: 'Room name is required' });
      }
  
      try {
        const response = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          const error = await response.json();
          return res.status(response.status).json({ error });
        }
  
        return res.status(200).json({ success: true });
      } catch (err) {
        return res.status(500).json({ error: 'Server error', details: err.message });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  