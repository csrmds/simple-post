-----deletePostImage Controller-----
chamada cloudinaryDelete
-----cloudinaryController deletePostImage-----
public_id:  682270d52fa0f688e1e2eb13_2
resp do cloudinaryDelete:  {
  cloudinary: { result: 'ok' },
  imageDbDeleted: {
    _id: '682270d92fa0f688e1e2eb22',
    postId: '682270d52fa0f688e1e2eb13',
    address: 'http://res.cloudinary.com/dufaejhwh/image/upload/v1747087576/682270d52fa0f688e1e2eb13_2.jpg',
    description: '682270d52fa0f688e1e2eb13_2',
    order: 2,
    source: 'cloudinary',
    public_id: '682270d52fa0f688e1e2eb13_2',
    asset_id: '57510d4b1142a1bda390d7906cda1b94',
    createdAt: '2025-05-12T22:06:17.802Z',
    updatedAt: '2025-05-12T22:06:17.802Z',
    __v: 0
  }
}
-----CloudinaryRenameOrderFiles-----
PostId:  682270d52fa0f688e1e2eb13
ListFileTemp:  []
listNewFileName:  []
FilesRenamed:  { listFile: [], listNewFileName: [] }

Response rename temp:  {
  asset_id: '1dae2002cbcb352ff975e69d18681c63',
  public_id: '682270d52fa0f688e1e2eb13_0_temp',
  display_name: '682270d52fa0f688e1e2eb13_0',
  url: 'http://res.cloudinary.com/dufaejhwh/image/upload/v1747087574/682270d52fa0f688e1e2eb13_0_temp.jpg'
}

Response rename temp:  {
  asset_id: 'd249aad5969bffa1756408bd28a6e262',
  public_id: '682270d52fa0f688e1e2eb13_1_temp',
  display_name: '682270d52fa0f688e1e2eb13_1',
  url: 'http://res.cloudinary.com/dufaejhwh/image/upload/v1747087575/682270d52fa0f688e1e2eb13_1_temp.jpg'
}

Response rename temp:  {
  asset_id: 'f712fa51d06677bf1f917ee638c634c1',
  public_id: '682270d52fa0f688e1e2eb13_3_temp',
  display_name: '682270d52fa0f688e1e2eb13_3',
  url: 'http://res.cloudinary.com/dufaejhwh/image/upload/v1747087577/682270d52fa0f688e1e2eb13_3_temp.jpg'
}
Laço rename New: {
  public_id: '682270d52fa0f688e1e2eb13_0_temp',
  id: '682270d92fa0f688e1e2eb1e'
} 0

Response rename displayName:  {
  asset_id: '1dae2002cbcb352ff975e69d18681c63',
  public_id: '682270d52fa0f688e1e2eb13_0_temp',
  display_name: '682270d52fa0f688e1e2eb13_0',
  url: 'http://res.cloudinary.com/dufaejhwh/image/upload/v1747087574/682270d52fa0f688e1e2eb13_0_temp.jpg'
}

Response rename publicId new:  {
  asset_id: '1dae2002cbcb352ff975e69d18681c63',
  public_id: '682270d52fa0f688e1e2eb13_0',
  display_name: '682270d52fa0f688e1e2eb13_0',
  url: 'http://res.cloudinary.com/dufaejhwh/image/upload/v1747087574/682270d52fa0f688e1e2eb13_0.jpg'
}
Laço rename New: {
  public_id: '682270d52fa0f688e1e2eb13_1_temp',
  id: '682270d92fa0f688e1e2eb20'
} 1

Response rename displayName:  {
  asset_id: 'd249aad5969bffa1756408bd28a6e262',
  public_id: '682270d52fa0f688e1e2eb13_1_temp',
  display_name: '682270d52fa0f688e1e2eb13_1',
  url: 'http://res.cloudinary.com/dufaejhwh/image/upload/v1747087575/682270d52fa0f688e1e2eb13_1_temp.jpg'
}

Response rename publicId new:  {
  asset_id: 'd249aad5969bffa1756408bd28a6e262',
  public_id: '682270d52fa0f688e1e2eb13_1',
  display_name: '682270d52fa0f688e1e2eb13_1',
  url: 'http://res.cloudinary.com/dufaejhwh/image/upload/v1747087575/682270d52fa0f688e1e2eb13_1.jpg'
}
Laço rename New: {
  public_id: '682270d52fa0f688e1e2eb13_3_temp',
  id: '682270d92fa0f688e1e2eb24'
} 2

Response rename displayName:  {
  asset_id: 'f712fa51d06677bf1f917ee638c634c1',
  public_id: '682270d52fa0f688e1e2eb13_3_temp',
  display_name: '682270d52fa0f688e1e2eb13_2',
  url: 'http://res.cloudinary.com/dufaejhwh/image/upload/v1747087577/682270d52fa0f688e1e2eb13_3_temp.jpg'
}

Response rename publicId new:  {
  asset_id: 'f712fa51d06677bf1f917ee638c634c1',
  public_id: '682270d52fa0f688e1e2eb13_2',
  display_name: '682270d52fa0f688e1e2eb13_2',
  url: 'http://res.cloudinary.com/dufaejhwh/image/upload/v1747087577/682270d52fa0f688e1e2eb13_2.jpg'
}
ImageListUpdated:  [
  {
    address: 'http://res.cloudinary.com/dufaejhwh/image/upload/v1747087574/682270d52fa0f688e1e2eb13_0.jpg',
    imageId: '682270d92fa0f688e1e2eb1e',
    order: 0
  },
  {
    address: 'http://res.cloudinary.com/dufaejhwh/image/upload/v1747087575/682270d52fa0f688e1e2eb13_1.jpg',
    imageId: '682270d92fa0f688e1e2eb20',
    order: 1
  },
  {
    address: 'http://res.cloudinary.com/dufaejhwh/image/upload/v1747087577/682270d52fa0f688e1e2eb13_2.jpg',
    imageId: '682270d92fa0f688e1e2eb24',
    order: 2
  }
]



















