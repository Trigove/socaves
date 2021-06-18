<template>
  <div class="wrapper">
    <div class="main-container">
      <div class="personal-container">
        <div class="per-image">BT</div>
        <div class="per-name">
          <p>Beter Yip</p>
          <p class="tag">@Betayip</p>
        </div>
      </div>
      <div class="friend-conatiner">
        <p>return</p>
        <div class="selection">
          <div class="followers">
            <p>Followers</p>
          </div>
          <div class="following">
            <p>Following</p>
          </div>
        </div>
        <div class="notice">
          <p>You are not following anyone yet</p>
          <p class="added-notice">
            When you do, they'll be listed here and you'll see their SOCAVE in
            your timeline.
          </p>
          <div class="btn-find">
            <a href="#">Find</a>
          </div>
        </div>
      </div>
    </div>
    <div class="left-container">
      <div class="search-bar">
        <img src="img/search.svg" />
        <p>Search SOCAVE</p>
      </div>
      <div class="box-see">
        <p>Who can see</p>
        <div class="box">
          <div class="box-container">
            <div class="friend-box">
              <div class="btn-closefriend">
                <img src="img/Vector (7).svg" />
              </div>
              <div class="add closefriend">
                <a href="#">Close Friend</a>
              </div>
            </div>
            <div class="friend-box">
              <div class="btn-closefriend">
                <img src="img/Vector (7).svg" />
              </div>
              <div class="add closefriend">
                <a href="#">Close Friend</a>
              </div>
            </div>
            <div class="friend-box">
              <div class="btn-closefriend">
                <img src="img/Vector (7).svg" />
              </div>
              <div class="add closefriend">
                <a href="#">Close Friend</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="box-friends">
        <div class="tittle-container">
          <p>Friends you may know...</p>
          <img />
        </div>
        <div class="new-box">
          <div class="new-image">EC</div>
          <p>Elizabeth</p>
          <div class="btn-newfriend">
            <a href="#">Follow</a>
          </div>
        </div>

        <div class="new-box">
          <div class="new-image">EC</div>
          <p>Elizabeth</p>
          <div class="btn-newfriend">
            <a href="#">Follow</a>
          </div>
        </div>
        <div class="new-box">
          <div class="new-image">EC</div>
          <p>Elizabeth</p>
          <div class="btn-newfriend">
            <a href="#">Follow</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  margin-right: 20px;
}
.personal-container {
  display: flex;
  margin: 10px 0 20px 70px;
}

.per-image {
  background: #c7d2fe;
  border: 5px solid #3b82f6;
  box-sizing: border-box;
  display: inline-block;
  padding: 50px;
  border-radius: 50%;
  color: #3b82f6;
  font-size: 32px;
}
.per-name {
  padding-top: 50px;
  padding-left: 26px;
  font-size: 32px;
}
.tag {
  font-size: 18px;
}
.selection {
  display: flex;
}
.followers {
  position: relative;
  text-align: center;
  cursor: pointer;
  color: #fb923c;
  font-size: 20px;
  padding: 0 200px;
  margin-left: 20px;
}
.followers::after {
  content: '';
  position: absolute;
  height: 2px;
  width: 100%;
  background: #fb923c;
  left: 0;
  bottom: -10px;
}
.following {
  position: relative;
  text-align: center;
  cursor: pointer;
  color: #28e2cc;
  font-size: 20px;
  padding: 0 200px;
}
.following p::after {
  content: '';
  position: absolute;
  height: 2px;
  width: 100%;
  background: #28e2cc;
  left: 0;
  bottom: -10px;
}
.notice {
  text-align: center;
  color: #28e2cc;
  text-decoration: none;
  font-size: 20px;
  padding-top: 70px;
}
.added-notice {
  color: #a1a1aa;
  font-size: 12px;
  padding-bottom: 30px;
  padding-top: 5px;
}
.btn-find {
  border-radius: 25px;
  background: #28e2cc;
  display: inline-block;
  padding: 5px 40px;
}
.btn-find a {
  text-decoration: none;
  font-size: 14px;
  color: #ffffff;
}

.search-bar {
  border-radius: 42px;
  background: #e4e4e7;
  display: flex;
  margin-top: 10px;
  padding-top: 5px;
  color: #a1a1aa;
  font-size: 14px;
}
.search-bar img {
  padding-left: 10px;
  padding-right: 20px;
  padding-bottom: 3px;
}
.search-bar p {
  padding-right: 14px;
  padding-top: 4px;
}
.box-see p {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 10px;
}
.box-container {
  display: flex;
  flex-wrap: wrap;
  box-shadow: 0px 24px 64px rgba(45, 48, 58, 0.06);
  padding-left: 4px;
  padding-bottom: 25px;
  margin-left: 20px;
  border-radius: 18px;
}
.friend-box {
  margin-bottom: 10px;
  margin-left: 13px;
  border: 1px solid rgba(149, 151, 161, 0.2);
  border-radius: 12px;
}

.btn-closefriend {
  border-radius: 50%;
  border: 2px solid #fdba74;
  background: #f97316;
  display: inline-block;
  padding: 4px;
  margin-left: 13px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.add a {
  border-radius: 25px;
  background: #f97316;
  color: #ffffff;
  display: inline-block;
  padding: 4px 5px;
  text-decoration: none;
  font-size: 10px;
  margin: 0 4px 4px;
}
.box-friends {
  margin-top: 20px;
  box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.1),
    0px 10px 10px rgba(0, 0, 0, 0.04);
  border-radius: 18px;
  padding-left: 4px;
  padding-bottom: 25px;
  margin-left: 20px;
}
.tittle-container {
  display: flex;
  flex-wrap: wrap;
}
.tittle-container p {
  text-align: center;
}
.new-box {
  border: 1px solid rgba(149, 151, 161, 0.2);
  display: inline-block;
  border-radius: 12px;
  margin-bottom: 10px;
  margin-left: 13px;
}
.new-image {
  font-size: 20px;
  border-radius: 50%;
  border: 2px solid #fdba74;
  background: #f97316;
  display: inline-block;
  padding: 4px;
  margin-left: 13px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.btn-newfriend a {
  border-radius: 25px;
  background: #f97316;
  color: #ffffff;
  display: inline-block;
  padding: 4px 5px;
  text-decoration: none;
  font-size: 10px;
  margin: 0 4px 4px;
}
</style>
