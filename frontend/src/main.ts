console.log("hello");
fetch("http://0.0.0.0:8888/similar?id=96166&results=5")
  .then((res) => res.json())
  .then((d) => {
    console.log(d);
  });
