#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SMTP 授权码读取器：授权码不入库。

真实凭证存放在仓库之外的用户目录文件 ~/.config/qqsmtp.json，形如：
    {"email": "...", "auth_code": "...", "smtp_server": "smtp.qq.com", "smtp_port": 465}

本文件只负责读取，不含任何明文凭证，因此可以安全提交。
找不到时给出明确提示，不会退回硬编码。
"""
import json
import os

SECRET_PATH = os.path.join(os.path.expanduser("~"), ".config", "qqsmtp.json")
_MISSING = (
    "未找到 SMTP 授权码文件：%s\n"
    "授权码已从仓库迁出，请在本地重建该文件（内容：{\"email\":..., \"auth_code\":...}）。"
)


def load_smtp_config():
    try:
        with open(SECRET_PATH, encoding="utf-8-sig") as f:
            cfg = json.load(f)
    except (FileNotFoundError, PermissionError):
        raise SystemExit(_MISSING % SECRET_PATH)
    if not cfg.get("auth_code"):
        raise SystemExit("文件 %s 存在，但缺少 auth_code 字段。" % SECRET_PATH)
    return cfg


CFG = load_smtp_config()
AUTH_CODE = CFG["auth_code"]
SENDER_EMAIL = CFG.get("email", "2142744149@qq.com")
SMTP_SERVER = CFG.get("smtp_server", "smtp.qq.com")
SMTP_PORT = int(CFG.get("smtp_port", 465))


def get_auth_code():
    """供老脚本按函数形式取用。"""
    return AUTH_CODE


if __name__ == "__main__":
    print("授权码读取正常，长度 %d 位（明文不打印）" % len(AUTH_CODE))
