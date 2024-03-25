# PIU DB

- SSL 떼버리자.. 어후 너무 까다롭다
- 우분투 - openssl - nodejs - prisma 궁합이 하나라도 안맞으면 너무 골치아프다

## 로드맵

- [x] 기본적인 숙제 등록 및 기록 반영 기능
- [x] 다른 사람 기록 보기 기능 (라이벌 기록은 테이블 분리하여 노출)
- [x] 숙제 동기화 더욱 쉽게
  - [x] 펌프 잇업 계정 로그인 => 브라우저에 정보 저장 기능 추가
  - [x] 동기화 하면 주 캐릭터 기록 불러오기
- [ ] 소개 페이지 추가
- [ ] UI 좀 더 이쁘게 고도화
- [ ] 라이벌 기능
- [ ] 숙제기능 고도화
  - [x] 브렉오프 기록도 불러오도록 수정
  - 숙제 참석 보너스?
  - 숙제 등록 알림?
  - 숙제 1,2,3등 보상?
  - 누적 통계 등

## 우분투 도커 설치

```sh
echo "uninstall all conflicting packages"

for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done

echo "set up docker's apt repository"

sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

echo "install docker packages"

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "docker permission"
sudo /usr/sbin/groupadd -f docker
sudo /usr/sbin/usermod -aG docker USER
sudo chown root:docker /var/run/docker.sock
```

## 도커 빌드

```sh
docker build -t piudb-web --platform linux/amd64 .
```

## 도커 실행

```sh
docker run -d -p 3000:3000 --name piudb-web piudb-web
```

## Artifact Registry 업로드

### 0. 저장소 인증

```sh
gcloud auth configure-docker REGION-docker.pkg.dev
```

### 0. 저장소 사용 설정 확인

```sh
gcloud artifacts repositories describe REPOSITORY \
    --project=PROJECT_ID \
    --location=REGION
```

### 1. 도커 로그인

```sh
cat KEY_FILE | docker login -u _json_key --password-stdin \
https://REGION-docker.pkg.dev
```

### 2. 로컬 이미지 태깅

```sh
docker tag piudb-web REGION-docker.pkg.dev/PROJECT_ID/ARTIFACT_REGISTRY_ID/piudb-web
```

### 3. 푸시

```sh
docker push REGION-docker.pkg.dev/PROJECT_ID/ARTIFACT_REGISTRY_ID/piudb-web
```

### 4. 풀

```sh
docker pull REGION-docker.pkg.dev/PROJECT_ID/ARTIFACT_REGISTRY_ID/piudb-web
```
