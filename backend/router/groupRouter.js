import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient } from '@prisma/client';
import asyncHandler from '../utils/asyncHandler.js';

const prisma = new PrismaClient();
const groupRouter = express.Router();
groupRouter.use(express.json());

groupRouter.route('/')

  // 그룹 목록 조회 - 수정 필요
  .get(asyncHandler(async (req, res) => {
    const groups = await prisma.group.findMany();
    res.status(200).send(groups);
  }))

  // 그룹 등록
  .post(asyncHandler(async (req, res) => {
    const { name, image, description, isPublic, password } = req.body;
    
    if (!name || !image || !description || isPublic === undefined || !password) {
      res.status(400).send({ message: "잘못된 요청입니다" });
    };

    const group = await prisma.group.create({
      data: {
        name,
        image,
        description,
        isPublic,
        password,
      },
    });
    res.status(201).send(group);
  }));

groupRouter.route('/:id')

  // 그룹 수정
  .put(asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, password, image, isPublic, description } = req.body;

    if (!password) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    const group = await prisma.group.findUnique({
      where: { id },
      select: {
        password: true,
      }
    });

    if (!group) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    if (group.password !== password) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }

    const updatedGroup = await prisma.group.update({
      where: { id },
      data: { name, image, isPublic, description },
    });

    return res.status(200).json(updatedGroup);
  }))

  // 그룹 상세 정보 조회
  .get(asyncHandler(async (req, res) => {
    const { id } = req.params;
    const group = await prisma.group.findUniqueOrThrow({
      where: { id },
      include: {
        memories: true,
      },
    });

    res.status(200).send(group);
  }))

  // 그룹 삭제
  .delete(asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    const group = await prisma.group.findUniqueOrThrow({
      where: { id },
    });

    if (!group) {
      res.status(404).send({ message: "존재하지 않습니다 "});
    };

    if (group.password !== password) {
      res.status(403).send({ message: "비밀번호가 틀렸습니다" });
    };

    await prisma.group.delete({
      where: { id },
    });

    res.status(200).send({ message: "그룹 삭제 성공" });
  }));

groupRouter.route('/:id/isPublic')

  // 그룹 공개 여부 확인
  .get(asyncHandler(async (req, res) => {
    const { id } = req.params;
    const group = await prisma.group.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        isPublic: true,
      },
    });

    res.status(200).send(group);
  }));

groupRouter.route('/:id/like')

  // 그룹 공감하기
  .post(asyncHandler(async (req, res) => {
    const { id } = req.params;

    const group = await prisma.group.findUniqueOrThrow({
      where: { id },
    });

    if (!group) {
      res.status(404).send({ message: "존재하지 않습니다" });
    };
    
    await prisma.group.update({
      where: { id },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });

    res.status(200).send({ message: "그룹 공감하기 성공" });
  }));

groupRouter.route('/:id/verifyPassword')

  // 그룹 조회 권한 확인
  .post(asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { password } = req.params;
    const group = await prisma.group.findUniqueOrThrow({
      where: { id },
      select: {
        password: true,
      },
    });

    if (group.password === password) {
      res.status(200).send({ message: "비밀번호가 확인되었습니다" });
    } else {
      res.status(401).send({ message: "비밀번호가 틀렸습니다" });
    };
  }));

export default groupRouter;