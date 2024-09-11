import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

const getMaxLinksCount = 100;
function getLinks(data) {
  const videoLinks = [];

  let idx = -1;
  let c = 0;

  while ((idx = data.indexOf('"url":"/watch?v=', idx + 1)) !== -1 && c < getMaxLinksCount) {
    c++;
    videoLinks.push(data.slice(idx + 16, idx + 27))
  }

  return videoLinks;
}

function generateRandomSearch() {
  const abc = 'abcdefghijklmnopqrstuvwxyz';

  const lenght = 2 + Math.floor(Math.random() * 4)

  let search = '';

  for (let i = 0; i < lenght; i++) {
    search += abc[Math.floor(Math.random() * abc.length)]
  }

  return search;
}

async function wait(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  });
}

const maxTries = 4;
const filter = 
  //  'EgIQAQ%253D%253D'    // video 
  // 'EgQQARgD'            // video & 4-20min
   'EgQQARgC'            // video & >20min
  
async function getRandomYouTubeVideo() {
  let videoLinks;
  let c = 0;
  
  do {
    const searchTerm = generateRandomSearch();
    console.log(`search term: ${searchTerm}`);
    let response;

    c++;
    try {
      response = await axios.get(`https://www.youtube.com/results?search_query=${searchTerm}&sp=${filter}`);
    } catch (error) {
      console.error("Error fetching youtube:", error);
      return;
    }
      
    videoLinks = getLinks(response.data);
    
    console.log(`got video links: ${videoLinks.length}`);
  } while (videoLinks.length === 0 && c < maxTries);
  
  if (videoLinks.length === 0) throw new Error('failed to fetch Youtube; ran out of attempts');

  const randomVideoLink = videoLinks[Math.floor(Math.random() * videoLinks.length)];

  console.log(`got the id: ${randomVideoLink}`);

  return randomVideoLink;
}

function validateID(id) {
  if (id.length !== 11) return false;

  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';

  console.log(`id: ${id}`)

  for (let i = 0; i < id.length; i++) {
    if (!characters.includes(id[i])) {
      console.log(`invalid id: ${id}`)

      return false;
    }
  }

  return true;
}


app.get("/new", async (req, res) => {
  console.log('getting new video');

  let id;

  try {
    id = await getRandomYouTubeVideo();
  }
  catch (err) {
    console.error('Error generating new video', err);

    res.send({
      success: false,
      id: 0,
      msg: err.message
    });

    return;
  }

  if ((id === undefined) || !validateID(id)) {
    console.log('sending invalid video\n')
    
    res.send({
      success: false,
      id: 0,
      msg: 'Invalid/undefined video'
    })
  }
  else {
    console.log('sending valid video\n')
    
    res.send({
      success: true,
      id: id,
    });
  }
});

app.listen(8000, () => {
  console.log("server running");
});
