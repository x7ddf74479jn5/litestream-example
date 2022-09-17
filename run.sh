#!/bin/sh
set -e

# コンテナ起動時に持っているSQLiteのデータベースファイルは、
# 後続処理でリストアに成功したら削除したいので、リネームしておく
if [ -f ./data.db ]; then
  mv ./data.db ./data.db.bk
fi

# Cloud Storage からリストア
litestream restore -if-replica-exists -config /etc/litestream.yml ./data.db

if [ -f ./data.db ]; then
  # リストアに成功したら、リネームしていたファイルを削除
  echo "---- Restored from Cloud Storage ----"
  rm ./data.db.bk
else
  # 初回起動時にはレプリカが未作成であり、リストアに失敗するので、
  # その場合には、冒頭でリネームしたdbファイルを元の名前に戻す
  echo "---- Failed to restore from Cloud Storage ----"
  mv ./data.db.bk ./data.db
fi

# メインプロセスに、litestreamによるレプリケーション、
# サブプロセスに Next.js アプリケーションを走らせる
exec litestream replicate -exec "yarn start" -config /etc/litestream.yml