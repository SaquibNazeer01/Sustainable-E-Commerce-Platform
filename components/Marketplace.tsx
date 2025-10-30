import React, { useState } from 'react';



interface MarketplaceItem {
  id: string;
  type: 'packaging' | 'household' | 'electronics';
  title: string;
  description: string;
  condition: string;
  imageUrl?: string;
  status: 'available' | 'claimed';
  owner: string;
  claimedBy?: string;
  claimedContact?: string;
}

interface Notification {
  itemId: string;
  message: string;
}

const initialItems: MarketplaceItem[] = [
  {
    id: '1',
    type: 'packaging',
    title: 'Box of clean plastic bottles',
    description: '20 PET bottles, washed and ready for recycling.',
    condition: 'Clean',
    status: 'available',
    owner: 'UserA',
  },
  {
    id: '2',
    type: 'household',
    title: 'Reusable glass jars',
    description: 'Set of 5 glass jars, perfect for storage or crafts.',
    condition: 'Good',
    status: 'available',
    owner: 'UserB',
  },
  {
    id: '3',
    type: 'electronics',
    title: 'Old smartphone for recycling',
    description: 'Android phone, not working, for e-waste recycling.',
    condition: 'For recycling',
    status: 'available',
    owner: 'UserC',
  },
];


const Marketplace: React.FC = () => {
  // No login required

  const [items, setItems] = useState<MarketplaceItem[]>(initialItems);
  const [form, setForm] = useState({
    type: 'packaging',
    title: '',
    description: '',
    condition: '',
    imageUrl: '',
  });
  const [claimForm, setClaimForm] = useState<{ name: string; contact: string; itemId: string | null }>({ name: '', contact: '', itemId: null });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.condition) return;
    setItems([
      ...items,
      {
        id: (items.length + 1).toString(),
        type: form.type as MarketplaceItem['type'],
        title: form.title,
        description: form.description,
        condition: form.condition,
        imageUrl: form.imageUrl || '',
        status: 'available',
        owner: 'Anonymous',
      },
    ]);
    setForm({ type: 'packaging', title: '', description: '', condition: '', imageUrl: '' });
  };

  const openClaimModal = (itemId: string) => {
    setClaimForm({ name: '', contact: '', itemId });
    setShowClaimModal(true);
  };

  const handleClaimInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClaimForm({ ...claimForm, [e.target.name]: e.target.value });
  };

  const submitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimForm.name || !claimForm.contact || !claimForm.itemId) return;
    setItems(items.map(item =>
      item.id === claimForm.itemId
        ? { ...item, status: 'claimed', claimedBy: claimForm.name, claimedContact: claimForm.contact }
        : item
    ));
    // Notify the owner
    const claimedItem = items.find(item => item.id === claimForm.itemId);
    if (claimedItem) {
      setNotifications([
        ...notifications,
        {
          itemId: claimedItem.id,
          message: `Your item "${claimedItem.title}" was claimed by ${claimForm.name}. Contact: ${claimForm.contact}`,
        },
      ]);
    }
    setShowClaimModal(false);
    setClaimForm({ name: '', contact: '', itemId: null });
  };

  // Scan Object Feature State
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Open camera
  const openScanModal = async () => {
    setScanResult(null);
    setShowScanModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setVideoStream(stream);
    } catch (err) {
      setScanResult('Camera access denied.');
    }
  };

  // Close camera
  const closeScanModal = () => {
    setShowScanModal(false);
    setScanResult(null);
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
  };

  // Simple green-detection logic
  const handleScan = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let greenPixels = 0;
    let totalPixels = imageData.width * imageData.height;
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      // Heuristic: green pixel if G is dominant and above threshold
      if (g > 80 && g > r + 20 && g > b + 20) greenPixels++;
    }
    const greenRatio = greenPixels / totalPixels;
    if (greenRatio > 0.18) {
      setScanResult('Eco-friendly ✅ (lots of green detected)');
    } else {
      setScanResult('Not eco-friendly ❌ (little green detected)');
    }
  };

  // Attach video stream to video element when modal is open and stream is available
  React.useEffect(() => {
    if (showScanModal && videoStream && videoRef.current) {
      // Force update srcObject every time modal opens or stream changes
      videoRef.current.srcObject = videoStream;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {/* ignore autoplay errors */});
      }
    }
    return () => {
      if (videoStream) videoStream.getTracks().forEach(track => track.stop());
    };
  }, [showScanModal, videoStream, videoRef.current]);

  // ...existing code...
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Waste-to-Wallet Marketplace</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="text-green-700 font-semibold">Welcome to the Marketplace</div>
        <button
          onClick={openScanModal}
          className="bg-emerald-700 text-white px-4 py-2 rounded shadow hover:bg-emerald-800 transition"
        >
          Scan Object
        </button>
      </div>
      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-6">
        <div className="flex flex-wrap gap-4 mb-2">
          <select name="type" value={form.type} onChange={handleInput} className="p-2 rounded">
            <option value="packaging">Used Packaging</option>
            <option value="household">Reusable Household Item</option>
            <option value="electronics">Electronics for Recycling</option>
          </select>
          <input name="title" value={form.title} onChange={handleInput} placeholder="Title" className="p-2 rounded flex-1" />
        </div>
        <textarea name="description" value={form.description} onChange={handleInput} placeholder="Description" className="p-2 rounded w-full mb-2" />
        <input name="condition" value={form.condition} onChange={handleInput} placeholder="Condition (e.g. Clean, Good, For recycling)" className="p-2 rounded w-full mb-2" />
        <input name="imageUrl" value={form.imageUrl} onChange={handleInput} placeholder="Image URL (optional)" className="p-2 rounded w-full mb-2" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">List Item</button>
      </form>
      <div>
        <h3 className="text-lg font-semibold mb-2">Available Items</h3>
        <div className="grid gap-4">
          {items.filter(item => item.status === 'available').map(item => (
            <div key={item.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/80x80?text=No+Image'}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded border"
                  style={{ background: '#222' }}
                />
                <div>
                  <div className="font-bold">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                  <div className="text-sm">{item.description}</div>
                  <div className="text-xs text-gray-500">Condition: {item.condition}</div>
                  <div className="text-xs text-gray-500">Owner: {item.owner}</div>
                </div>
              </div>
              <button onClick={() => openClaimModal(item.id)} className="bg-blue-600 text-white px-3 py-1 rounded mt-2 md:mt-0">Claim for Circular Supply</button>
            </div>
          ))}
        </div>
        <h3 className="text-lg font-semibold mt-8 mb-2">Claimed by Vendors</h3>
        <div className="grid gap-4">
          {items.filter(item => item.status === 'claimed').map(item => (
            <div key={item.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center justify-between bg-green-50">
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/80x80?text=No+Image'}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded border"
                  style={{ background: '#222' }}
                />
                <div>
                  <div className="font-bold">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                  <div className="text-sm">{item.description}</div>
                  <div className="text-xs text-gray-500">Condition: {item.condition}</div>
                  <div className="text-xs text-gray-500">Owner: {item.owner}</div>
                  {item.claimedBy && item.claimedContact && (
                    <div className="text-xs mt-2 px-2 py-1 rounded bg-black text-white font-semibold w-fit">Claimed by: {item.claimedBy} (<span className="underline text-white">{item.claimedContact}</span>)</div>
                  )}
                </div>
              </div>
              <span className="text-green-700 font-semibold mt-2 md:mt-0">Claimed</span>
            </div>
          ))}
        </div>
        {/* Notification section for item owners - removed for public marketplace */}
      </div>

      {/* Scan Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4">Scan Object</h3>
            <div className="w-full rounded mb-2 bg-black" style={{ maxHeight: 240, minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                autoPlay
                playsInline
                muted
                style={{ maxHeight: 240, minHeight: 180, background: '#000' }}
              />
              {!videoStream && (
                <span className="text-gray-500 text-center w-full absolute">Camera not available or permission denied.</span>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <button
              onClick={handleScan}
              className="bg-green-700 text-white px-4 py-2 rounded mb-2 w-full"
            >
              Scan
            </button>
            {scanResult && (
              <div className="text-center font-semibold text-lg mb-2">
                {scanResult}
              </div>
            )}
            <button
              onClick={closeScanModal}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={submitClaim} className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Claim Item</h3>
            <input name="name" value={claimForm.name} onChange={handleClaimInput} placeholder="Your Name" className="p-2 rounded w-full mb-2" />
            <input name="contact" value={claimForm.contact} onChange={handleClaimInput} placeholder="Contact Info (email or phone)" className="p-2 rounded w-full mb-2" />
            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" onClick={() => setShowClaimModal(false)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Submit Claim</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
